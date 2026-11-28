$port = 8080
$prefix = "http://localhost:$port/"
$folder = "C:\Users\KaushikMosik\.gemini\antigravity\scratch\virtuwear-ai\web"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls11

function Test-PublicHttpUri {
    param([string]$RawUrl)
    try {
        $uri = $null
        if (-not [Uri]::TryCreate($RawUrl, [UriKind]::Absolute, [ref]$uri)) { return $null }
        if ($uri.Scheme -ne "http" -and $uri.Scheme -ne "https") { return $null }
        $hostName = $uri.DnsSafeHost
        if ([string]::IsNullOrWhiteSpace($hostName) -or $hostName -eq "localhost") { return $null }
        $addrs = [System.Net.Dns]::GetHostAddresses($hostName)
        foreach ($addr in $addrs) {
            if ([System.Net.IPAddress]::IsLoopback($addr)) { return $null }
            $b = $addr.GetAddressBytes()
            if ($addr.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork) {
                if ($b[0] -eq 10 -or $b[0] -eq 127 -or $b[0] -eq 0 -or
                    ($b[0] -eq 169 -and $b[1] -eq 254) -or
                    ($b[0] -eq 172 -and $b[1] -ge 16 -and $b[1] -le 31) -or
                    ($b[0] -eq 192 -and $b[1] -eq 168)) {
                    return $null
                }
            } elseif ($addr.IsIPv6LinkLocal -or $addr.IsIPv6SiteLocal -or ($b[0] -band 0xFE) -eq 0xFC) {
                return $null
            }
        }
        return $uri
    } catch {
        return $null
    }
}

function Invoke-FetchUrl {
    param([Uri]$TargetUri, [int]$TimeoutMs = 8000)
    $req = [System.Net.HttpWebRequest]::Create($TargetUri)
    $req.Method = "GET"
    $req.Timeout = $TimeoutMs
    $req.ReadWriteTimeout = $TimeoutMs
    $req.AllowAutoRedirect = $true
    $req.MaximumAutomaticRedirections = 5
    $req.AutomaticDecompression = [System.Net.DecompressionMethods]::GZip -bor [System.Net.DecompressionMethods]::Deflate
    $req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    $req.Accept = "text/html,application/xhtml+xml,image/avif,image/webp,image/apng,image/*,*/*;q=0.8"

    $resp = $req.GetResponse()
    try {
        $ctype = if ($resp.ContentType) { $resp.ContentType } else { "application/octet-stream" }
        $finalUri = $resp.ResponseUri.AbsoluteUri
        $ms = New-Object System.IO.MemoryStream
        $stream = $resp.GetResponseStream()
        $buf = New-Object byte[] 32768
        $maxBytes = 12 * 1024 * 1024
        while ($true) {
            $read = $stream.Read($buf, 0, $buf.Length)
            if ($read -le 0) { break }
            if (($ms.Length + $read) -gt $maxBytes) { break }
            $ms.Write($buf, 0, $read)
        }
        return @{
            ContentType = $ctype
            FinalUrl    = $finalUri
            Bytes       = $ms.ToArray()
        }
    } finally {
        $resp.Close()
    }
}

function Get-QueryParam {
    param([string]$Query, [string]$Key)
    if ([string]::IsNullOrEmpty($Query)) { return "" }
    $trimmed = $Query.TrimStart('?')
    foreach ($pair in $trimmed -split '&') {
        $kv = $pair -split '=', 2
        if ($kv.Length -eq 2 -and $kv[0] -eq $Key) {
            return [System.Uri]::UnescapeDataString($kv[1].Replace('+', ' '))
        }
    }
    return ""
}

function Send-JsonResponse {
    param($Response, [int]$StatusCode, $PayloadObj)
    $Response.StatusCode = $StatusCode
    $Response.ContentType = "application/json; charset=utf-8"
    $Response.Headers.Add("Access-Control-Allow-Origin", "*")
    $json = ($PayloadObj | ConvertTo-Json -Compress)
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $Response.ContentLength64 = $bytes.Length
    $Response.OutputStream.Write($bytes, 0, $bytes.Length)
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "YURI AI Web Server started at $prefix"
    Write-Host "Serving files from $folder"
    
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            $localPath = $request.Url.LocalPath
            if ($localPath -eq "/api/extract-garment") {
                $rawTarget = Get-QueryParam -Query $request.Url.Query -Key "url"
                $targetUri = Test-PublicHttpUri -RawUrl $rawTarget
                if (-not $targetUri) {
                    Send-JsonResponse -Response $response -StatusCode 400 -PayloadObj @{ ok = $false; error = "Invalid or non-public store URL." }
                    $response.Close()
                    continue
                }
                try {
                    $fetched = Invoke-FetchUrl -TargetUri $targetUri -TimeoutMs 8000
                    $ctypeLower = $fetched.ContentType.ToLower()
                    if ($ctypeLower.StartsWith("image/")) {
                        $proxyUrl = "/api/proxy-image?url=" + [System.Uri]::EscapeDataString($fetched.FinalUrl)
                        Send-JsonResponse -Response $response -StatusCode 200 -PayloadObj @{
                            ok          = $true
                            isDirectImg = $true
                            imageUrl    = $fetched.FinalUrl
                            proxiedUrl  = $proxyUrl
                            title       = ""
                        }
                    } else {
                        $html = [System.Text.Encoding]::UTF8.GetString($fetched.Bytes)
                        $extractedImg = ""
                        $patterns = @(
                            '<meta[^>]+property=["'']og:image(?::secure_url)?["''][^>]+content=["'']([^"'']+)["'']',
                            '<meta[^>]+content=["'']([^"'']+)["''][^>]+property=["'']og:image(?::secure_url)?["'']',
                            '<meta[^>]+name=["'']twitter:image(?::src)?["''][^>]+content=["'']([^"'']+)["'']',
                            '<meta[^>]+content=["'']([^"'']+)["''][^>]+name=["'']twitter:image(?::src)?["'']',
                            '"hiRes"\s*:\s*"(https?:[^"]+)"',
                            '"large"\s*:\s*"(https?:[^"]+)"',
                            'data-old-hires=["'']([^"'']+)["'']',
                            'data-zoom-image=["'']([^"'']+)["'']',
                            '<img[^>]+itemprop=["'']image["''][^>]+src=["'']([^"'']+)["'']',
                            '"image"\s*:\s*\[\s*"(https?:[^"]+)"',
                            '"image"\s*:\s*"(https?:[^"]+)"',
                            '"contentUrl"\s*:\s*"(https?:[^"]+)"'
                        )
                        foreach ($pat in $patterns) {
                            $m = [regex]::Match($html, $pat, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
                            if ($m.Success -and -not [string]::IsNullOrWhiteSpace($m.Groups[1].Value)) {
                                $candidate = $m.Groups[1].Value.Trim()
                                $candidate = $candidate.Replace('\/', '/').Replace('\u002F', '/').Replace('\u0026', '&')
                                $extractedImg = [System.Net.WebUtility]::HtmlDecode($candidate)
                                break
                            }
                        }
                        if ($extractedImg.StartsWith("//")) {
                            $extractedImg = $targetUri.Scheme + ":" + $extractedImg
                        } elseif ($extractedImg.StartsWith("/")) {
                            $extractedImg = $targetUri.GetLeftPart([System.UriPartial]::Authority) + $extractedImg
                        }
                        $titleMatch = [regex]::Match($html, '<meta[^>]+property=["'']og:title["''][^>]+content=["'']([^"'']+)["'']|<title[^>]*>([^<]+)</title>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
                        $extractedTitle = ""
                        if ($titleMatch.Success) {
                            $rawT = if ($titleMatch.Groups[1].Value) { $titleMatch.Groups[1].Value } else { $titleMatch.Groups[2].Value }
                            $extractedTitle = [System.Net.WebUtility]::HtmlDecode($rawT.Trim())
                            $extractedTitle = ($extractedTitle -replace '\s*[\|\-–—]\s*(Buy|Shop|Myntra|Zara|Amazon|Flipkart|H&M|AJIO).*$','').Trim()
                        }
                        if (-not [string]::IsNullOrWhiteSpace($extractedImg) -and (Test-PublicHttpUri -RawUrl $extractedImg)) {
                            $proxyUrl = "/api/proxy-image?url=" + [System.Uri]::EscapeDataString($extractedImg)
                            Send-JsonResponse -Response $response -StatusCode 200 -PayloadObj @{
                                ok          = $true
                                isDirectImg = $false
                                finalUrl    = $fetched.FinalUrl
                                imageUrl    = $extractedImg
                                proxiedUrl  = $proxyUrl
                                title       = $extractedTitle
                            }
                        } else {
                            Send-JsonResponse -Response $response -StatusCode 200 -PayloadObj @{
                                ok       = $false
                                blocked  = $true
                                finalUrl = $fetched.FinalUrl
                                title    = $extractedTitle
                                error    = "Store page did not expose an OpenGraph cloth image."
                            }
                        }
                    }
                } catch {
                    Send-JsonResponse -Response $response -StatusCode 200 -PayloadObj @{
                        ok      = $false
                        blocked = $true
                        error   = $_.Exception.Message
                    }
                }
                $response.Close()
                continue
            }

            if ($localPath -eq "/api/proxy-image") {
                $rawTarget = Get-QueryParam -Query $request.Url.Query -Key "url"
                $targetUri = Test-PublicHttpUri -RawUrl $rawTarget
                if (-not $targetUri) {
                    $response.StatusCode = 400
                    $response.Close()
                    continue
                }
                try {
                    $fetched = Invoke-FetchUrl -TargetUri $targetUri -TimeoutMs 8000
                    $ctypeLower = $fetched.ContentType.ToLower()
                    if (-not $ctypeLower.StartsWith("image/") -and -not $ctypeLower.StartsWith("application/octet-stream")) {
                        $response.StatusCode = 415
                        $response.Close()
                        continue
                    }
                    $response.StatusCode = 200
                    $response.ContentType = $fetched.ContentType
                    $response.Headers.Add("Access-Control-Allow-Origin", "*")
                    $response.Headers.Add("Cache-Control", "public, max-age=3600")
                    $response.ContentLength64 = $fetched.Bytes.Length
                    if ($request.HttpMethod -ne "HEAD") {
                        $response.OutputStream.Write($fetched.Bytes, 0, $fetched.Bytes.Length)
                    }
                } catch {
                    $response.StatusCode = 502
                }
                $response.Close()
                continue
            }

            if ($localPath -eq "/" -or $localPath -eq "") {
                $localPath = "/index.html"
            }
            
            $filePath = Join-Path $folder $localPath.TrimStart('/')
            
            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                switch ($ext) {
                    ".html" { $response.ContentType = "text/html; charset=utf-8" }
                    ".css"  { $response.ContentType = "text/css" }
                    ".js"   { $response.ContentType = "application/javascript" }
                    ".json" { $response.ContentType = "application/json" }
                    ".png"  { $response.ContentType = "image/png" }
                    ".jpg"  { $response.ContentType = "image/jpeg" }
                    ".jpeg" { $response.ContentType = "image/jpeg" }
                    ".webp" { $response.ContentType = "image/webp" }
                    ".svg"  { $response.ContentType = "image/svg+xml" }
                    default { $response.ContentType = "application/octet-stream" }
                }
                $response.ContentLength64 = $bytes.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.ContentLength64 = $msg.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
            $response.Close()
        } catch {
            Write-Warning "Request error: $_"
        }
    }
} finally {
    $listener.Stop()
}
