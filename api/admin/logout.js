import { clearSessionCookie, json, method } from '../_lib/admin.js';

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;
  clearSessionCookie(res);
  json(res, 200, { ok: true });
}
