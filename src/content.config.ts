import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const marcas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/marcas' }),
  schema: z.object({
    nombre: z.string(),
    slug: z.string(),
    descripcion: z.string(),
    descripcionCorta: z.string(),
    beneficios: z.array(z.string()),
    logo: z.string(),
    colorPrimario: z.string(),
    colorSecundario: z.string(),
    colorTexto: z.string().default('#FFFFFF'),
    orden: z.number(),
    activa: z.boolean().default(true),
  }),
});

const productos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/productos' }),
  schema: z.object({
    nombre: z.string(),
    slug: z.string(),
    marca: z.string(),
    categoria: z.enum([
      'aceites',
      'arroz',
      'azucar',
      'legumbres',
      'pastas',
      'enlatados',
      'carbon',
    ]),
    tipo: z.string(),
    formato: z.string(),
    imagen: z.string(),
    descripcion: z.string().optional(),
    activo: z.boolean().default(true),
    orden: z.number().default(0),
  }),
});

export const collections = { marcas, productos };
