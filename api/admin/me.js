import { getSession, json, method } from '../_lib/admin.js';

export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  const session = getSession(req);
  json(res, 200, {
    loggedIn: Boolean(session),
    username: session?.username || null,
    codeVerified: Boolean(session?.codeVerified),
  });
}
