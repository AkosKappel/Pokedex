// Writes one HTML file per route into dist/ after `vite build`. Each file is the normal app shell
// with its own title, description, canonical URL and social preview tags, so GitHub Pages answers
// deep links with 200 instead of the 404 fallback, and link previews show the right Pokémon.
// Also writes 404.html (the SPA fallback for anything else), sitemap.xml and robots.txt.
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const SITE = 'https://akoskappel.github.io/Pokedex/';
const ARTWORK = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
const dist = new URL('../dist/', import.meta.url);

const shell = await readFile(new URL('index.html', dist), 'utf8');
const pokedex = JSON.parse(await readFile(new URL('../src/data/pokedex.json', import.meta.url), 'utf8'));

const escape = text => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const titleCase = slug => slug.charAt(0).toUpperCase() + slug.slice(1);

const render = ({ path, title, description, image = `${SITE}og-image.png`, large = true }) => {
  const url = SITE + path;
  const tags = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Pokédex" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="${large ? 'summary_large_image' : 'summary'}" />`,
  ].join('\n    ');
  return shell
    .replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/s, `$1${escape(description)}$2`)
    .replace('</head>', `    ${tags}\n  </head>`);
};

const pages = [
  {
    path: '',
    title: 'Pokédex: every Pokémon at a glance',
    description: `Browse all ${pokedex.length} Pokémon: search by name or number, filter by type and region, and see stats, evolutions and type matchups.`,
  },
  {
    path: 'pokemon/',
    title: 'Browse Pokémon · Pokédex',
    description: `All ${pokedex.length} Pokémon, filtered by type and region.`,
  },
  {
    path: 'compare/',
    title: 'Compare Pokémon · Pokédex',
    description: 'Compare the base stats and types of up to three Pokémon.',
  },
  { path: 'favorites/', title: 'Favorites · Pokédex', description: 'Your favorite Pokémon, saved in this browser.' },
  {
    path: 'about/',
    title: 'About · Pokédex',
    description: 'What this Pokédex is, how it is built and where its data comes from.',
  },
  ...pokedex.map(species => {
    const number = `#${String(species.id).padStart(4, '0')}`;
    const types = species.types.map(titleCase).join(' and ');
    return {
      path: `pokemon/${species.id}/`,
      title: `${species.name} ${number} · Pokédex`,
      description: `${species.name} is ${/^[AEIOU]/.test(types) ? 'an' : 'a'} ${types} type Pokémon. See its base stats, abilities, evolutions, weaknesses and artwork.`,
      image: `${ARTWORK}/${species.id}.png`,
      large: false,
    };
  }),
];

for (const page of pages) {
  const directory = new URL(page.path, dist);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), render(page));
}

await writeFile(new URL('404.html', dist), shell);

const indexed = pages.filter(page => page.path !== 'favorites/');
await writeFile(
  new URL('sitemap.xml', dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexed
    .map(page => `  <url><loc>${SITE}${page.path}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
);
await writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);

console.log(`Prerendered ${pages.length} pages`);
