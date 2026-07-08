const fs = require('fs');
const path = require('path');

const srcSeqDir = path.join(__dirname, '..', 'src', 'assets', 'sequence');
const srcVideo = path.join(__dirname, '..', 'src', 'assets', 'A_close_up_hyper_realistic_ma.mp4');

const destDir = path.join(__dirname, '..', 'public', 'assets');
const destSeqDir = path.join(destDir, 'sequence');
const destVideo = path.join(destDir, 'crema-core.mp4');

// Ensure destination directories exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}
if (!fs.existsSync(destSeqDir)) {
  fs.mkdirSync(destSeqDir, { recursive: true });
}

// Copy video
console.log('Copying video...');
if (fs.existsSync(srcVideo)) {
  fs.copyFileSync(srcVideo, destVideo);
  console.log(`Video copied to ${destVideo}`);
} else {
  console.error(`Source video not found at ${srcVideo}`);
}

// Load sharp or fallback
let sharp;
try {
  sharp = require('sharp');
  console.log('sharp library loaded successfully. Starting conversion to WebP...');
} catch (e) {
  console.warn('sharp library not found. Falling back to copy-and-rename (as WebP)...');
}

const totalFrames = 120;
(async () => {
  try {
    for (let i = 1; i <= totalFrames; i++) {
      const srcIndex = String(i).padStart(3, '0');
      const srcName = `ezgif-frame-${srcIndex}.png`;
      const srcPath = path.join(srcSeqDir, srcName);

      const destName = `cylinder_${srcIndex}.webp`;
      const destPath = path.join(destSeqDir, destName);

      if (fs.existsSync(srcPath)) {
        if (sharp) {
          // Convert to webp with alpha channel intact
          await sharp(srcPath)
            .webp({ quality: 80, lossless: false })
            .toFile(destPath);
        } else {
          // Fallback: copy as-is (with .webp extension)
          fs.copyFileSync(srcPath, destPath);
        }
        if (i % 20 === 0 || i === totalFrames) {
          console.log(`Processed ${i}/${totalFrames} frames...`);
        }
      } else {
        console.error(`Source frame not found: ${srcPath}`);
      }
    }
    console.log('Asset prep complete!');
  } catch (err) {
    console.error('Error during asset preparation:', err);
  }
})();
