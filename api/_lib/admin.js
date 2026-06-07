import crypto from 'node:crypto';

const SESSION_COOKIE = 'rsj_admin_session';
const MAX_AGE = 60 * 60 * 8;

export function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function timingSafeEqualText(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function verifySecret(value, hashEnvName, plainEnvName) {
  const fallbackHashes = {
    ADMIN_PASSWORD_HASH: '6d5cbc6cc076b611901c1508a199e9b4ae83d8f021ea6c5d3ec55ff6ec826dcc',
    ADMIN_PERMISSION_CODE_HASH: '7a8f2bc7f4ef2305768c7c90f9e0df8bf157631039ff2cb1a477525938a8aa20',
  };
  const expectedHash = process.env[hashEnvName]?.trim() || fallbackHashes[hashEnvName];
  if (expectedHash) return timingSafeEqualText(sha256(value), expectedHash);

  const expectedPlain = process.env[plainEnvName]?.trim();
  if (expectedPlain) return timingSafeEqualText(value, expectedPlain);

  return false;
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 24) {
    throw new Error('SESSION_SECRET must be configured and at least 24 characters long.');
  }
  return secret;
}

function sign(payload) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
}

function encodeSession(session) {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function decodeSession(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  if (!timingSafeEqualText(signature, sign(payload))) return null;

  const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (!session.exp || Date.now() > session.exp) return null;
  return session;
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

export function setSessionCookie(res, username, codeVerified = false) {
  const token = encodeSession({
    username,
    codeVerified,
    exp: Date.now() + MAX_AGE * 1000,
  });

  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
  );
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}

export function getSession(req) {
  const cookies = parseCookies(req);
  return decodeSession(cookies[SESSION_COOKIE]);
}

export function requireAdmin(req, res, requireCode = true) {
  const session = getSession(req);
  if (!session) {
    json(res, 401, { error: 'Not logged in' });
    return null;
  }
  if (requireCode && !session.codeVerified) {
    json(res, 403, { error: 'Permission code required' });
    return null;
  }
  return session;
}

export function method(req, res, allowed) {
  if (allowed.includes(req.method)) return true;
  res.setHeader('Allow', allowed.join(', '));
  json(res, 405, { error: 'Method not allowed' });
  return false;
}
