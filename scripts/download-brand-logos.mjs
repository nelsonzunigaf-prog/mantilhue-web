import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const BASE = 'https://mantilhuealimentos.cl/wp-content/uploads/2023/10';
const logos = [
  { url: `${BASE}/logo-El-Marques.png`, out: 'public/images/logos/el-marques.png' },
  { url: `${BASE}/logo-El-Monarca.png`, out: 'public/images/logos/el-monarca.png' },
  { url: `${BASE}/logo-Maiten.png`, out: 'public/images/logos/maiten.png' },
  { url: `${BASE}/logo-El-Valle.png`, out: 'public/images/logos/carbon-el-valle.png' },
];

for (const item of logos) {
  try {
    const res = await fetch(item.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(item.out, buffer);
    console.log(`✓ ${item.out} (${(buffer.length/1024).toFixed(0)}KB)`);
  } catch (err) {
    console.error(`✗ ${item.url}: ${err.message}`);
  }
}
console.log('\nDone!');
