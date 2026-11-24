const fs = require('fs');
const path = require('path');

// Ensure directories exist
const targets = ['public', 'dist', 'build', '.'];

targets.forEach(dir => {
  if (dir !== '.' && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync(
    path.join(__dirname, 'web/index.html'),
    path.join(__dirname, dir, 'index.html')
  );
  fs.copyFileSync(
    path.join(__dirname, 'web/sen-jersey.webp'),
    path.join(__dirname, dir, 'sen-jersey.webp')
  );
});

console.log('✅ YURI AI Vercel Build: Copied index.html and sen-jersey.webp to root, public/, dist/, and build/ directories.');
