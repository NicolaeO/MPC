# Posts

Each article is one HTML file named `YYYY-MM-DD-short-slug.html`. After adding or editing a post, run
`npm run generate-posts-index` (it also runs automatically before every build).

## Template

```html
<!doctype html>
<html>
<head>
    <meta name="title" content="The Full Article Title">
    <meta name="date" content="2026-10-17">
    <meta name="category" content="Finance">   <!-- Finance | Career | Housing | Settling In | Health -->
    <meta name="excerpt" content="One or two sentences shown on article cards (≤180 characters).">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
<div class="container">
    <div class="heading">
        <h1>Short Title</h1>          <!-- hidden on the site; the page header shows the meta title -->
        <p>Intro paragraph, shown as the lead.</p>
    </div>

    <h2>Section heading</h2>          <!-- every h2 appears in the "On this page" sidebar -->
    <p>Body text…</p>

    <div class="takeaway">
        <h2>The Takeaway</h2>
        <p>Closing summary.</p>
    </div>
</div>
</body>
</html>
```

Add `<meta name="draft" content="true">` to keep a file out of the index while you work on it.
Apostrophes and quotes are fine inside `content="…"` (use `&quot;` for a literal double quote).

## Building blocks

Style comes from `src/styles/post.css` — don't use inline `style` attributes.

| Markup | Renders as |
|---|---|
| `<div class="row">` + `<div class="card"><div class="card-header"><h1>…</h1></div><div class="card-body">…</div></div>` | Responsive card grid. Add `tone-red`, `tone-orange`, `tone-yellow`, `tone-green` or `tone-blue` to `card-header` for colour. |
| `<a class="btn" href="…">` inside a `card-body` | Button-style link |
| `<div class="callout">` / `callout callout-warning` / `callout callout-success` | Info, warning and success boxes |
| `<div class="table-wrap"><table>…</table></div>` | Scrollable table. Use `class="num"` on numeric cells, `text-good` / `text-warn` / `text-bad` for colour. |
| `<div class="formula">` | Monospace formula block |
| `<blockquote>` | Highlighted quote or script |
| `<div class="takeaway">` | Closing summary box |
| `<a href="/post/other-slug">` | Internal link (stays inside the app, no page reload) |

## Interactive widgets

| Markup | Widget |
|---|---|
| `<ul data-checklist="unique-id" data-title="Title"><li>…</li></ul>` | Checklist with progress, saved in the visitor's browser |
| `<div data-widget="mortgage-calculator" data-price="400000" data-down="20" data-rate="7" data-years="30"></div>` | Mortgage calculator |
| `<div data-widget="compound-growth" data-initial="0" data-monthly="500" data-rate="7" data-years="30"></div>` | Investment growth calculator |
| `<div data-widget="budget-planner" data-income="4500" data-essentials="2400" data-saved="1000"></div>` | 50/30/20 budget + emergency fund planner |

All `data-*` defaults are optional. Widgets live in `src/components/widgets/`.
