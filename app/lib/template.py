import html


def build_post_html(post: dict) -> str:
    """Wraps generated content in the MPC post HTML template."""
    # Escape (rather than strip) quotes and apostrophes — scripts/generate-posts.js decodes entities.
    title = html.escape(post["title"])
    intro = html.escape(post["intro"])
    category = html.escape(post.get("category") or "General")

    return f"""<!doctype html>
<html>
<head>
    <meta name="title" content="{title}">
    <meta name="date" content="{post['date']}">
    <meta name="category" content="{category}">
    <meta name="excerpt" content="{intro}">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
<div class="container">
    <div class="heading">
        <h1>{title}</h1>
        <p>{intro}</p>
    </div>
    {post['content']}
</div>
</body>
</html>"""
