import sharp from 'sharp';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'public/images/gallery';

const mapping = {
  'candidate-5953794.jpg': { out: 'equipo-bodega.webp', width: 1600 },
};

for (const [src, { out, width }] of Object.entries(mapping)) {
  const input = join(DIR, src);
  const output = join(DIR, out);
  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(output);
  await unlink(input);
  console.log(`✓ ${out}`);
}
