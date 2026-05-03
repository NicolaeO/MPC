import base64
import os

import requests

from .template import build_post_html

API = "https://api.github.com"


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def _check(response: requests.Response, context: str) -> dict:
    if not response.ok:
        raise RuntimeError(
            f"GitHub API {response.status_code} on {context}: {response.text[:300]}"
        )
    return response.json()


def submit_to_github(post: dict) -> dict:
    owner = os.environ["GITHUB_OWNER"]
    repo = os.environ["GITHUB_REPO"]
    base = os.environ.get("GITHUB_BASE_BRANCH", "master")
    repo_url = f"{API}/repos/{owner}/{repo}"

    # 1. Get SHA of base branch
    ref = _check(
        requests.get(f"{repo_url}/git/ref/heads/{base}", headers=_headers()),
        f"get ref heads/{base}",
    )
    sha = ref["object"]["sha"]

    # 2. Create new branch
    branch = f"auto-post/{post['slug']}"
    _check(
        requests.post(
            f"{repo_url}/git/refs",
            headers=_headers(),
            json={"ref": f"refs/heads/{branch}", "sha": sha},
        ),
        "create branch",
    )
    print(f"[github] Created branch: {branch}")

    # 3. Commit the post HTML file
    html = build_post_html(post)
    encoded = base64.b64encode(html.encode("utf-8")).decode("ascii")
    file_path = f"public/posts/{post['slug']}.html"

    _check(
        requests.put(
            f"{repo_url}/contents/{file_path}",
            headers=_headers(),
            json={
                "message": f"auto: add article \"{post['title']}\"",
                "content": encoded,
                "branch": branch,
            },
        ),
        f"commit {file_path}",
    )
    print(f"[github] Committed: {file_path}")

    # 4. Open pull request
    pr = _check(
        requests.post(
            f"{repo_url}/pulls",
            headers=_headers(),
            json={
                "title": f"[Auto] {post['title']}",
                "body": (
                    f"Auto-generated article by MPC News Generator.\n\n"
                    f"**Title:** {post['title']}\n"
                    f"**Date:** {post['date']}\n\n"
                    f"Review and merge to publish on the site."
                ),
                "head": branch,
                "base": base,
            },
        ),
        "create pull request",
    )
    print(f"[github] Pull request: {pr['html_url']}")

    return {"pr_url": pr["html_url"], "branch": branch}
