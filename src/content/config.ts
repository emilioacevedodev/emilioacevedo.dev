import { defineCollection, z } from 'astro:content';

// Definimos el "esquema" para la colección de posts del blog
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string().transform((str) => new Date(str)), // Transforma el string de fecha a un objeto Date
    category: z.string(),
    heroImage: z.string(),
  }),
});

// Definimos el "esquema" para la colección de avances del proyecto
const projectCollection = defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.string().transform((str) => new Date(str)),
      category: z.string(),
      heroImage: z.string(),
    }),
  });

// Exportamos las colecciones para que Astro las reconozca
export const collections = {
  'blog': blogCollection,
  'project': projectCollection,
};
