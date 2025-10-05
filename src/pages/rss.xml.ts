import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blogPosts = await getCollection('blog');
  const projectPosts = await getCollection('project');
  const allPosts = [...blogPosts, ...projectPosts].sort(
    (a, b) => new Date(b.data.publishDate).valueOf() - new Date(a.data.publishDate).valueOf()
  );

  return rss({
    // `<title>` en el feed RSS
    title: 'Emilio Acevedo | Blog & Project Log',
    // `<description>` en el feed RSS
    description: 'A chronicle of a journey into 3D web development and software engineering.',
    // Punto final del sitio web desde el que se genera el feed RSS.
    site: context.site || 'https://emilioacevedo.dev',
    // Array de todas las entradas del feed RSS
    items: allPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.publishDate),
      description: post.data.description,
      // Enlace al post en tu sitio web.
      link: `/${post.collection}/${post.slug}/`,
    })),
    // (Opcional) Añade datos personalizados al feed RSS.
    customData: `<language>en-us</language>`,
  });
}

