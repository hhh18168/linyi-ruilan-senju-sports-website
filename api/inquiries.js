import { json, method, readJsonBody } from './_lib/admin.js';
import { writeJson } from './_lib/github.js';

function clean(value, max = 800) {
  return String(value || '').trim().slice(0, max);
}

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;

  try {
    const body = await readJsonBody(req);
    const inquiry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: clean(body.name, 120),
      contact: clean(body.contact, 160),
      product: clean(body.product, 180),
      quantity: clean(body.quantity, 80),
      message: clean(body.message, 1000),
      source: clean(body.source, 120),
      createdAt: new Date().toISOString(),
    };

    if (!inquiry.name || !inquiry.contact || !inquiry.product || !inquiry.quantity) {
      json(res, 400, { error: 'Missing required fields.' });
      return;
    }

    const day = inquiry.createdAt.slice(0, 10);
    await writeJson(`inquiries/${day}/${inquiry.id}.json`, inquiry, `Add inquiry ${inquiry.id}`, 'GITHUB_DATA_REPO');
    json(res, 200, { ok: true });
  } catch (error) {
    json(res, 500, { error: error.message });
  }
}
