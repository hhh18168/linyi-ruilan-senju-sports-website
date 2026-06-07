import { json, method, readJsonBody, requireAdmin } from '../_lib/admin.js';
import { upsertFile } from '../_lib/github.js';

const MAX_BYTES = 2 * 1024 * 1024;

function safeName(name) {
  return String(name || 'product-image')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;
  if (!requireAdmin(req, res)) return;

  try {
    const body = await readJsonBody(req);
    const filename = safeName(body.filename);
    const contentType = String(body.contentType || '');
    const base64 = String(body.base64 || '').replace(/^data:[^;]+;base64,/, '');
    const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    const bytes = Buffer.from(base64, 'base64');

    if (!contentType.startsWith('image/')) {
      json(res, 400, { error: 'Only image files are allowed.' });
      return;
    }

    if (bytes.length > MAX_BYTES) {
      json(res, 400, { error: 'Image must be smaller than 2MB.' });
      return;
    }

    const path = `public/uploads/products/${Date.now()}-${filename}.${extension}`;
    await upsertFile(path, bytes.toString('base64'), `Upload product image ${filename}`);
    json(res, 200, { ok: true, url: path.replace(/^public/, '') });
  } catch (error) {
    json(res, 500, { error: error.message });
  }
}
