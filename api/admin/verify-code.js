import { getSession, json, method, readJsonBody, setSessionCookie, verifySecret } from '../_lib/admin.js';

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;

  try {
    const session = getSession(req);
    if (!session) {
      json(res, 401, { error: '请先登录管理员账号。' });
      return;
    }

    const body = await readJsonBody(req);
    const code = String(body.code || '');

    if (!verifySecret(code, 'ADMIN_PERMISSION_CODE_HASH', 'ADMIN_PERMISSION_CODE')) {
      json(res, 403, { error: '权限码错误。' });
      return;
    }

    setSessionCookie(res, session.username, true);
    json(res, 200, { ok: true, codeVerified: true });
  } catch (error) {
    json(res, 500, { error: error.message });
  }
}
