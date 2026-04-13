import sharp from 'sharp';
import { writeFile } from 'fs/promises';

const brands = [
  { name: 'El Marqués', file: 'el-marques', bg: '#C62828', text: '#FFFFFF' },
  { name: 'El Monarca', file: 'el-monarca', bg: '#1B5E20', text: '#FFFFFF' },
  { name: 'Maitén', file: 'maiten', bg: '#F57F17', text: '#FFFFFF' },
  { name: 'Carbón El Valle', file: 'carbon-el-valle', bg: '#4E342E', text: '#FFFFFF' },
];

for (const brand of brands) {
  const svg = `
    <svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="100" rx="12" fill="${brand.bg}"/>
      <text x="150" y="58" font-family="Arial, sans-serif" font-weight="bold" font-size="24"
        fill="${brand.text}" text-anchor="middle" dominant-baseline="middle">
        ${brand.name}
      </text>
    </svg>
  `;

  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  const outPath = `public/images/logos/${brand.file}.png`;
  await writeFile(outPath, buffer);
  console.log(`✓ ${outPath} (${(buffer.length/1024).toFixed(0)}KB)`);
}

console.log('\n✅ Brand logos generated (placeholder — replace with real logos)');
