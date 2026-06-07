const DEFAULT_BRANCH = process.env.GITHUB_BRANCH || 'main';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function repoConfig(repoEnvName = 'GITHUB_SITE_REPO') {
  return {
    owner: requireEnv('GITHUB_OWNER'),
    repo: requireEnv(repoEnvName),
    branch: DEFAULT_BRANCH,
    token: requireEnv('GITHUB_TOKEN'),
  };
}

async function githubFetch(path, options = {}) {
  const token = requireEnv('GITHUB_TOKEN');
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status}: ${text}`);
  }

  return response.status === 204 ? null : response.json();
}

export async function readFile(path, repoEnvName = 'GITHUB_SITE_REPO') {
  const { owner, repo, branch } = repoConfig(repoEnvName);
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const data = await githubFetch(`/repos/${owner}/${repo}/contents/${encodedPath}?ref=${branch}`);
  const content = Buffer.from(data.content || '', 'base64').toString('utf8');
  return { content, sha: data.sha };
}

export async function readJson(path, repoEnvName = 'GITHUB_SITE_REPO') {
  const file = await readFile(path, repoEnvName);
  return { data: JSON.parse(file.content), sha: file.sha };
}

export async function upsertFile(path, contentBase64, message, repoEnvName = 'GITHUB_SITE_REPO') {
  const { owner, repo, branch } = repoConfig(repoEnvName);
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');

  let sha;
  try {
    const existing = await githubFetch(`/repos/${owner}/${repo}/contents/${encodedPath}?ref=${branch}`);
    sha = existing.sha;
  } catch (error) {
    if (!String(error.message).includes('404')) throw error;
  }

  return githubFetch(`/repos/${owner}/${repo}/contents/${encodedPath}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
}

export async function writeJson(path, data, message, repoEnvName = 'GITHUB_SITE_REPO') {
  const content = Buffer.from(`${JSON.stringify(data, null, 2)}\n`, 'utf8').toString('base64');
  return upsertFile(path, content, message, repoEnvName);
}

export async function deleteFile(path, message, repoEnvName = 'GITHUB_SITE_REPO') {
  const { owner, repo, branch } = repoConfig(repoEnvName);
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const existing = await githubFetch(`/repos/${owner}/${repo}/contents/${encodedPath}?ref=${branch}`);

  return githubFetch(`/repos/${owner}/${repo}/contents/${encodedPath}`, {
    method: 'DELETE',
    body: JSON.stringify({
      message,
      sha: existing.sha,
      branch,
    }),
  });
}
