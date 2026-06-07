import { json, method, readJsonBody, requireAdmin } from '../_lib/admin.js';
import { readJson, writeJson } from '../_lib/github.js';

const FILE_PATH = 'public/cms/layout-settings.json';

export default async function handler(req, res) {
  if (!method(req, res, ['GET', 'PUT'])) return;
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      const { data } = await readJson(FILE_PATH);
      json(res, 200, data);
      return;
    }

    const body = await readJsonBody(req);
    await writeJson(FILE_PATH, body.settings || body, 'Update CMS layout settings');
    json(res, 200, { ok: true });
  } catch (error) {
    json(res, 500, { error: error.message });
  }
}
