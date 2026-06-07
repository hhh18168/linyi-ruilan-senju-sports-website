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
    const files = Array.isArray(body.files)
      ? body.files
      : [{ filename: body.filename, contentType: body.contentType, base64: body.base64 }];
    const uploads = [];

    if (files.length > 20) {
      json(res, 400, { error: 'A maximum of 20 images can be uploaded at once.' });
      return;
    }

    for (const file of files) {
    const filename = safeName(file.filename);
    const contentType = String(file.contentType || '');
    const base64 = String(file.base64 || '').replace(/^data:[^;]+;base64,/, '');
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

    const path = `public/uploads/products/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${filename}.${extension}`;
    await upsertFile(path, bytes.toString('base64'), `Upload product image ${filename}`);
    uploads.push({ url: path.replace(/^public/, '') });
    }

    json(res, 200, { ok: true, url: uploads[0]?.url, urls: uploads.map((item) => item.url) });
  } catch (error) {
    json(res, 500, { error: error.message });
  }
}
