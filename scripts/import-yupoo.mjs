import { mkdir, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { basename, join } from 'node:path';
import { pipeline } from 'node:stream/promises';

const baseUrl = 'https://qubu.x.yupoo.com';
const outputDir = join(process.cwd(), 'public', 'yupoo-products');
const dataFile = join(process.cwd(), 'src', 'yupooProducts.ts');
const maxAlbumsPerCategory = 2;
const maxImagesPerAlbum = 6;

const decodeHtml = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const slugify = (text) => {
  const normalizedText = displayName(text);
  const ascii = normalizedText
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
  return ascii || `item-${Math.random().toString(36).slice(2, 8)}`;
};

function displayName(text) {
  const decoded = decodeHtml(text).trim();
  const english = decoded.match(/\(([^)]+)\)/)?.[1]?.trim();
  return english || decoded.replace(/[^\x20-\x7E]+/g, ' ').replace(/\s+/g, ' ').trim();
}

const fetchText = async (url) => {
  const response = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    },
  });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.text();
};

const fetchBuffer = async (url) => {
  const response = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      referer: baseUrl,
    },
  });
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`);
  return response;
};

const uniqueBy = (items, keyFn) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const parseCategories = (html) => {
  const categories = [];
  const categoryRegex = /<a[^>]+class="[^"]*show-layout-category__catetitle[^"]*"[^>]+title="([^"]+)"[^>]+href="\/collections\/(\d+)"[^>]*>/g;
  for (const match of html.matchAll(categoryRegex)) {
    categories.push({
      id: match[2],
      title: displayName(match[1]),
      slug: slugify(match[1]),
    });
  }
  return uniqueBy(categories, (category) => category.id);
};

const parseAlbumsForCategory = (html, categoryId) => {
  const albums = [];
  const albumRegex = new RegExp(
    `title="([^"]+)"\\s+href="(/albums/\\d+\\?uid=1&isSubCate=false&referrercate=${categoryId})"`,
    'g',
  );
  for (const match of html.matchAll(albumRegex)) {
    const title = displayName(match[1]);
    albums.push({
      id: match[2].match(/\/albums\/(\d+)/)?.[1] ?? slugify(title),
      title,
      slug: slugify(title),
      url: `${baseUrl}${decodeHtml(match[2])}`,
    });
  }
  return uniqueBy(albums, (album) => album.id).slice(0, maxAlbumsPerCategory);
};

const parseImages = (html) => {
  const urls = [...html.matchAll(/https:\/\/photo\.yupoo\.com\/[^"'<> ]+/g)]
    .map((match) => decodeHtml(match[0]))
    .filter((url) => !url.includes('/icons/'))
    .filter((url) => !url.endsWith('/small.jpg'))
    .filter((url) => !url.endsWith('/medium.jpg'))
    .filter((url) => !url.endsWith('/square.jpg'));

  const normalized = uniqueBy(urls, (url) => {
    const parts = new URL(url).pathname.split('/');
    return parts.slice(1, 3).join('/');
  });

  const preferred = normalized.filter((url) => url.endsWith('/big.jpg'));
  return (preferred.length ? preferred : normalized).slice(0, maxImagesPerAlbum);
};

const extFor = (url) => {
  const ext = basename(new URL(url).pathname).split('.').pop()?.toLowerCase();
  return ext && ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
};

const main = async () => {
  await mkdir(outputDir, { recursive: true });
  const homeHtml = await fetchText(`${baseUrl}/albums`);
  const categories = parseCategories(homeHtml);
  const products = [];

  for (const category of categories) {
    const categoryDir = join(outputDir, category.slug);
    await mkdir(categoryDir, { recursive: true });
    const albums = parseAlbumsForCategory(homeHtml, category.id);

    for (const album of albums) {
      const albumHtml = await fetchText(album.url);
      const images = parseImages(albumHtml);

      for (const [index, imageUrl] of images.entries()) {
        const number = String(index + 1).padStart(2, '0');
        const ext = extFor(imageUrl);
        const filename = `${album.slug}-${number}.${ext}`;
        const filePath = join(categoryDir, filename);
        const publicPath = `/yupoo-products/${category.slug}/${filename}`;
        const response = await fetchBuffer(imageUrl);
        await pipeline(response.body, createWriteStream(filePath));

        products.push({
          id: `${category.slug}-${album.slug}-${number}`,
          name: `${album.title}-${number}`,
          category: category.title,
          categorySlug: category.slug,
          album: album.title,
          image: publicPath,
          sourceUrl: album.url,
        });
      }
    }
  }

  const content = `export type YupooProduct = {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  album: string;
  image: string;
  sourceUrl: string;
};

export const yupooProducts: YupooProduct[] = ${JSON.stringify(products, null, 2)};

export const yupooCategories = Array.from(
  new Map(yupooProducts.map((product) => [product.categorySlug, product.category])).entries(),
).map(([slug, name]) => ({ slug, name }));
`;

  await writeFile(dataFile, content, 'utf8');
  console.log(`Imported ${products.length} Yupoo sample products from ${categories.length} categories.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
