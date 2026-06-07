import { json, method, readJsonBody, setSessionCookie, verifySecret } from '../_lib/admin.js';

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;

  try {
    const body = await readJsonBody(req);
    const username = String(body.username || '').trim();
    const password = String(body.password || '');

    if (!username || !password) {
      json(res, 400, { error: 'Username and password are required.' });
      return;
    }

    if (username !== process.env.ADMIN_USERNAME || !verifySecret(password, 'ADMIN_PASSWORD_HASH', 'ADMIN_PASSWORD')) {
      json(res, 401, { error: 'Invalid username or password.' });
      return;
    }

    setSessionCookie(res, username, false);
    json(res, 200, { ok: true, codeVerified: false });
  } catch (error) {
    json(res, 500, { error: error.message });
  }
}
