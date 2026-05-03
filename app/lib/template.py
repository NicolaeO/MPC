def build_post_html(post: dict) -> str:
    """Wraps generated content in the MPC post HTML template."""
    # Strip apostrophes from title so the meta regex in generate-posts.js doesn't choke
    safe_title = post["title"].replace('"', "&quot;").replace("'", "")

    return f"""<!doctype html>
<html>
<head>
    <meta name="title" content="{safe_title}">
    <meta name="date" content="{post['date']}">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
<div class="container">
    <div class="heading">
        <h1>{post['title']}</h1>
        <p>{post['intro']}</p>
    </div>
    {post['content']}
</div>
</body>
</html>"""
