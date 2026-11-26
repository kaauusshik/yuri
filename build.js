const fs = require('fs');
const path = require('path');

// Target directories for Vercel and static hosting
const targets = ['public', 'dist', 'build', '.'];
const webDir = path.join(__dirname, 'web');

// Find all asset files in web/
const files = fs.readdirSync(webDir);
const assetFiles = files.filter(f => f.match(/\.(html|webp|jpg|jpeg|png|svg|ico)$/i));

targets.forEach(dir => {
  const destDirPath = path.join(__dirname, dir);
  if (dir !== '.' && !fs.existsSync(destDirPath)) {
    fs.mkdirSync(destDirPath, { recursive: true });
  }

  assetFiles.forEach(file => {
    const src = path.join(webDir, file);
    const dest = path.join(destDirPath, file);
    fs.copyFileSync(src, dest);
  });
});

console.log(`✅ YURI AI Build: Successfully synced ${assetFiles.length} files (${assetFiles.join(', ')}) to root, public/, dist/, and build/ directories.`);
