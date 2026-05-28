const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_IMAGE = './public/logo-master.png';
const OUTPUT_DIR = './public/assets/icons';
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateIcons() {
  console.log('Generando iconos PWA...\n');
  for (const size of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    await sharp(SOURCE_IMAGE)
      .resize(size, size, {
        fit: 'contain',
        background: '#0f172a'
      })
      .png()
      .toFile(outputPath);
    console.log(`✓ icon-${size}x${size}.png`);
  }
  console.log(`\n¡${SIZES.length} iconos generados en ${OUTPUT_DIR}!`);
}
generateIcons().catch(console.error);
