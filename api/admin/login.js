import { json, method, readJsonBody, setSessionCookie, verifySecret } from '../_lib/admin.js';

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;

  try {
    const body = await readJsonBody(req);
    const username = String(body.username || '').trim();
    const password = String(body.password || '');

    if (!username || !password) {
      json(res, 400, { error: '请输入管理员账号和登录密码。' });
      return;
    }

    const expectedUsername = process.env.ADMIN_USERNAME?.trim() || 'admin';

    if (!expectedUsername) {
      json(res, 500, { error: '后台登录环境变量未配置完整，请检查 ADMIN_USERNAME 和 ADMIN_PASSWORD_HASH。' });
      return;
    }

    if (username !== expectedUsername || !verifySecret(password, 'ADMIN_PASSWORD_HASH', 'ADMIN_PASSWORD')) {
      json(res, 401, { error: '管理员账号或登录密码错误。' });
      return;
    }

    setSessionCookie(res, username, false);
    json(res, 200, { ok: true, codeVerified: false });
  } catch (error) {
    json(res, 500, { error: error.message });
  }
}
