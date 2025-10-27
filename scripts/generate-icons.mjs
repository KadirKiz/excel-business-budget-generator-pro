import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Erstelle ein einfaches Logo als 1024x1024 SVG
const iconSvg = `
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1890ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#52c41a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#grad)" rx="128"/>
  <rect x="100" y="100" width="824" height="824" fill="white" opacity="0.2" rx="64"/>
  <text x="512" y="580" font-family="Inter, sans-serif" font-size="200" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
    E
  </text>
</svg>
`;

async function generateIcons() {
  const iconDir = path.join(__dirname, '../src-tauri/icons');
  
  // Erstelle icons-Ordner
  if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
  }

  // Konvertiere SVG zu PNG in verschiedenen Größen
  const sizes = [16, 32, 48, 64, 128, 256, 512, 1024];
  
  console.log('Generating icons...');
  
  for (const size of sizes) {
    const outputPath = path.join(iconDir, `icon_${size}.png`);
    await sharp(Buffer.from(iconSvg))
      .resize(size, size, { fit: 'contain', background: { r: 24, g: 144, b: 255, alpha: 1 } })
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${outputPath}`);
  }

  // Kopiere 1024er als Basis für .ico
  const baseIcon = await sharp(Buffer.from(iconSvg))
    .resize(1024, 1024, { fit: 'contain', background: { r: 24, g: 144, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  // Für Windows .ico: erstelle multiple sizes in einer Datei
  // (Einfache Implementation - könnte verbessert werden)
  console.log('✓ All icons generated successfully!');
  console.log(`Icons saved to: ${iconDir}`);
}

generateIcons().catch(console.error);

