export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const { name, email, title, content } = await request.json();

    if (!name || !email || !title || !content) {
      return new Response('Missing fields', { status: 400 });
    }

    const repo = env.REPO; // e.g. "your-user/mpc-site"
    const githubToken = env.GITHUB_TOKEN;
    const baseBranch = env.BRANCH_BASE || 'main';
    const apiBase = 'https://api.github.com';

    // 1. Create a new branch
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const date = new Date().toISOString().split('T')[0];
    const branchName = `submit-${date}-${slug}`;

    // Get latest commit SHA of base branch
    const refRes = await fetch(`${apiBase}/repos/${repo}/git/ref/heads/${baseBranch}`, {
      headers: { Authorization: `token ${githubToken}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    const refJson = await refRes.json();
    const baseSha = refJson.object.sha;

    // Create new branch ref
    await fetch(`${apiBase}/repos/${repo}/git/refs`, {
      method: 'POST',
      headers: { Authorization: `token ${githubToken}`, 'Accept': 'application/vnd.github.v3+json' },
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: baseSha
      })
    });

    // 2. Create a new file in posts folder  
    const path = `public/posts/${date}-${slug}.html`;
    const contentHtml = `<!doctype html>
<html>
<head>
  <meta name="title" content="${title}">
  <meta name="date" content="${date}">
</head>
<body>
  <h2>${title}</h2>
  <p>Submitted by ${name} (${email})</p>
  <div>${content}</div>
</body>
</html>
`;
    const encoded = btoa(contentHtml);

    await fetch(`${apiBase}/repos/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: { Authorization: `token ${githubToken}`, 'Accept': 'application/vnd.github.v3+json' },
      body: JSON.stringify({
        message: `Add new post: ${title}`,
        content: encoded,
        branch: branchName
      })
    });

    // 3. Create a Pull Request
    const prRes = await fetch(`${apiBase}/repos/${repo}/pulls`, {
      method: 'POST',
      headers: { Authorization: `token ${githubToken}`, 'Accept': 'application/vnd.github.v3+json' },
      body: JSON.stringify({
        title: `New post submission: ${title}`,
        head: branchName,
        base: baseBranch,
        body: `Submitted by ${name} (${email})\n\nPlease review the post.`
      })
    });
    const prJson = await prRes.json();

    return new Response(JSON.stringify({ success:true, prUrl: prJson.html_url }), {
      headers: { 'Content-Type': 'application/json' },
      status: 201
    });
  }
}
