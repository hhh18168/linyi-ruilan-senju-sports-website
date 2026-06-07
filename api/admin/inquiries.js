import { json, method, requireAdmin } from '../_lib/admin.js';

async function githubFetch(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  return response.json();
}

export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  if (!requireAdmin(req, res)) return;

  try {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_DATA_REPO || process.env.GITHUB_SITE_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const root = await githubFetch(`/repos/${owner}/${repo}/contents/inquiries?ref=${branch}`).catch(() => []);
    const days = Array.isArray(root) ? root.filter((item) => item.type === 'dir').slice(-20).reverse() : [];
    const inquiries = [];

    for (const day of days) {
      const files = await githubFetch(`/repos/${owner}/${repo}/contents/${day.path}?ref=${branch}`).catch(() => []);
      for (const file of files.filter((item) => item.type === 'file' && item.name.endsWith('.json'))) {
        const item = await githubFetch(`/repos/${owner}/${repo}/contents/${file.path}?ref=${branch}`);
        inquiries.push(JSON.parse(Buffer.from(item.content || '', 'base64').toString('utf8')));
      }
    }

    json(res, 200, { inquiries: inquiries.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))) });
  } catch (error) {
    json(res, 500, { error: error.message });
  }
}
