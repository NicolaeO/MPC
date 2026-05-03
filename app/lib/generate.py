import json
import re
from datetime import date

import anthropic

from .topics import get_todays_topic

SYSTEM_PROMPT = (
    "You are a practical writer creating helpful articles for the MPC community — "
    "professionals (many originally from Moldova and Eastern Europe) living and working in the USA. "
    "Your audience may not be native English speakers, so write clearly and avoid unnecessary jargon. "
    "Be accurate, specific, and actionable. Do not include generic filler advice."
)

USER_PROMPT_TEMPLATE = """\
Write a practical, helpful article about the following topic for professionals living in the USA:

TOPIC: {topic}

Requirements:
- 400-600 words of actual content
- Broken into 3-5 sections with <h2> headings
- Use <p> for paragraphs, <ul>/<li> for bullet lists, <strong> for key terms
- Include at least one concrete example, number, or actionable step
- End with a short practical takeaway or summary paragraph

Respond ONLY with a JSON object in this exact format (no markdown, no extra text):
{{
  "title": "The full article title",
  "slug_suffix": "short-url-slug-no-spaces-no-apostrophes",
  "intro": "One sentence summary used as the post excerpt",
  "content": "<h2>First Section</h2><p>Full article HTML here...</p>"
}}"""


def generate_post(override_topic: str | None = None) -> dict:
    """Call Claude to generate an article and return a post dict."""
    topic = override_topic or get_todays_topic()
    today = date.today().isoformat()

    print(f"[generate] Topic: {topic!r}")

    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[
            {"role": "user", "content": USER_PROMPT_TEMPLATE.format(topic=topic)}
        ],
    )

    raw = response.content[0].text.strip()

    # Claude occasionally wraps JSON in a code block — strip it
    if raw.startswith("```"):
        match = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", raw)
        raw = match.group(1) if match else raw

    parsed = json.loads(raw)

    slug = f"{today}-{parsed['slug_suffix']}"

    return {
        "title": parsed["title"],
        "date": today,
        "slug": slug,
        "intro": parsed["intro"],
        "content": parsed["content"],
        "usage": {
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
        },
    }
