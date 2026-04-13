import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const BASE = 'https://mantilhuealimentos.cl/wp-content/uploads';

// Logos (mantener PNG)
const logos = [
  { url: `${BASE}/2023/08/Logo-mantilhue-foto.png`, out: 'public/images/logos/mantilhue-color.png' },
  { url: `${BASE}/2023/08/Logo-Mantilhue-blanco.png`, out: 'public/images/logos/mantilhue-blanco.png' },
];

// Productos (convertir a WebP)
const productos = [
  { url: `${BASE}/2023/10/aceite.png`, out: 'public/images/productos/aceite-el-marques-5l.webp' },
  { url: `${BASE}/2023/10/Aceite-El-Marques.png`, out: 'public/images/productos/aceite-el-marques-900ml.webp' },
  { url: `${BASE}/2023/10/Aceite-El-Monarca.png`, out: 'public/images/productos/aceite-el-monarca-900ml.webp' },
  { url: `${BASE}/2023/10/Arroz-El-Marques.png`, out: 'public/images/productos/arroz-el-marques-1kg.webp' },
  { url: `${BASE}/2023/10/Arroz-El-Monarca.png`, out: 'public/images/productos/arroz-el-monarca-g1-1kg.webp' },
  { url: `${BASE}/2023/10/Arroz-Grado-2-El-Monarca.png`, out: 'public/images/productos/arroz-el-monarca-g2-1kg.webp' },
  { url: `${BASE}/2023/10/Arroz-El-Maiten.png`, out: 'public/images/productos/arroz-maiten-900g.webp' },
  { url: `${BASE}/2023/10/Azucar-El-Marques.png`, out: 'public/images/productos/azucar-el-marques-1kg.webp' },
  { url: `${BASE}/2023/10/Azucar-El-Monarca.png`, out: 'public/images/productos/azucar-el-monarca-1kg.webp' },
  { url: `${BASE}/2023/10/Azucar-El-Maiten.png`, out: 'public/images/productos/azucar-maiten-900g.webp' },
  { url: `${BASE}/2023/10/Lentejas-El-Monarca.png`, out: 'public/images/productos/lentejas-el-monarca-1kg.webp' },
  { url: `${BASE}/2023/10/Porotos-Blancos-El-Monarca.png`, out: 'public/images/productos/porotos-blancos-el-monarca-1kg.webp' },
  { url: `${BASE}/2023/10/Poroto-Hallado-El-Monarca.png`, out: 'public/images/productos/porotos-hallados-el-monarca-1kg.webp' },
  { url: `${BASE}/2023/10/Porotos-Negros-El-Monarca.png`, out: 'public/images/productos/porotos-negros-el-monarca-1kg.webp' },
  { url: `${BASE}/2023/10/Garbanzos-El-Monarca.png`, out: 'public/images/productos/garbanzos-el-monarca-1kg.webp' },
  { url: `${BASE}/2023/10/Arverjas-El-Monarca-1.png`, out: 'public/images/productos/arvejas-el-monarca-1kg.webp' },
  { url: `${BASE}/2024/02/pastas_elmarques.png`, out: 'public/images/productos/espirales-el-marques-400g.webp' },
  { url: `${BASE}/2024/02/spaghetti_elmarques.png`, out: 'public/images/productos/spaghetti-el-marques-400g.webp' },
];

// Instalaciones (mantener JPG original)
const instalaciones = [
  { url: `${BASE}/2023/10/Mantilhue-04.jpg`, out: 'public/images/instalaciones/bodega-01.jpg' },
  { url: `${BASE}/2023/10/Mantilhue-07.jpg`, out: 'public/images/instalaciones/bodega-02.jpg' },
  { url: `${BASE}/2023/10/Mantilhue-08.jpg`, out: 'public/images/instalaciones/bodega-03.jpg' },
];

// Slider / Hero
const hero = [
  { url: `${BASE}/2023/08/Slider-1-e1691769409489.png`, out: 'public/images/hero-bg.png' },
];

// Marcas logos (intentar descargar de las cards de producto)
const marcasLogos = [
  { url: `${BASE}/2023/08/994cc20d9a-removebg-preview.png`, out: 'public/images/logos/productos-marca.png' },
];

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function processItem(item, convertToWebp = false) {
  const dir = path.dirname(item.out);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });

  try {
    console.log(`  Downloading: ${path.basename(item.url)}`);
    const buffer = await download(item.url);

    if (convertToWebp) {
      const webp = await sharp(buffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
      await writeFile(item.out, webp);
      const savings = ((1 - webp.length / buffer.length) * 100).toFixed(0);
      console.log(`  ✓ ${path.basename(item.out)} (${(webp.length/1024).toFixed(0)}KB, -${savings}%)`);
    } else {
      await writeFile(item.out, buffer);
      console.log(`  ✓ ${path.basename(item.out)} (${(buffer.length/1024).toFixed(0)}KB)`);
    }
  } catch (err) {
    console.error(`  ✗ FAILED ${item.url}: ${err.message}`);
  }
}

async function main() {
  console.log('\n=== LOGOS ===');
  for (const item of logos) await processItem(item, false);

  console.log('\n=== PRODUCTOS (→ WebP) ===');
  for (const item of productos) await processItem(item, true);

  console.log('\n=== INSTALACIONES ===');
  for (const item of instalaciones) await processItem(item, false);

  console.log('\n=== HERO ===');
  for (const item of hero) await processItem(item, false);

  console.log('\n=== EXTRAS ===');
  for (const item of marcasLogos) await processItem(item, false);

  console.log('\n✅ Done!\n');
}

main();
