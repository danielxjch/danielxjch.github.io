# danielxu.dev — Portfolio

Personal portfolio of **Daniel Xu**, mechanical engineering student at Georgia Tech focused on robotics and autonomous systems. Live at [danielxjch.github.io](https://danielxjch.github.io).

## Stack

- [Jekyll](https://jekyllrb.com/) static site, built and deployed automatically by **GitHub Pages** on every push to `main`
- No JS frameworks, no build pipeline — hand-written Liquid templates, one stylesheet, a few lines of vanilla JS
- Content is driven by two things:
  - **`_config.yml`** — name, headline, bio, social links, skills, contact form key, and the color theme
  - **`_projects/<name>/index.md`** — one folder per project, images alongside the markdown

## Local development

```sh
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

## Adding a project

Create `_projects/my-project/` containing an `index.md` and its images:

```yaml
---
layout: post
title: My Project
description: One-paragraph summary shown on the card and page header.
skills:
  - CAD
  - Python
main-image: /cover.png   # file in the same folder
---
```

Then write the body in markdown. Two includes are available:

```liquid
{% include image-gallery.html images="a.png, b.png" height="400" %}
{% include youtube-video.html id="VIDEO_ID" %}
```

## Theming

The whole palette lives in the `colors:` map in `_config.yml` — swap the active block for one of the documented presets (drafting light / blueprint dark) or your own values, and the CSS picks it up via custom properties.

## License

Code is MIT; project write-ups and media are all rights reserved (see [LICENSE](LICENSE)). The site started from the Free-To-Engineer template by lowinertia.com (CC0) and has since been fully redesigned.
