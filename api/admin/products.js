import { json, method, readJsonBody, requireAdmin } from '../_lib/admin.js';
import { readJson, writeJson } from '../_lib/github.js';

const FILE_PATH = 'public/cms/products.json';
const LITE_FILE_PATH = 'public/cms/products-lite.json';

async function readProductsSafely() {
  try {
    const { data } = await readJson(FILE_PATH);
    if (Array.isArray(data)) return data;
  } catch {
    // Fall back to the lightweight catalog when the legacy full JSON is invalid.
  }

  const { data: liteProducts } = await readJson(LITE_FILE_PATH);
  if (!Array.isArray(liteProducts)) return [];

  return liteProducts;
}

export default async function handler(req, res) {
  if (!method(req, res, ['GET', 'PUT'])) return;
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      json(res, 200, await readProductsSafely());
      return;
    }

    const body = await readJsonBody(req);
    if (!Array.isArray(body.products)) {
      json(res, 400, { error: 'products must be an array.' });
      return;
    }

    await writeJson(FILE_PATH, body.products, 'Update CMS products');
    json(res, 200, { ok: true });
  } catch (error) {
    json(res, 500, { error: error.message });
  }
}
