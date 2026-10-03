# Catalog preview

`signup-example.png` is a browser rendering of `signup-example.html`. It shows
the prompt and the published “With clueless” output excerpt from
[`examples/signup-form.md`](../../examples/signup-form.md), with its existing
limitations intact. It is an illustrative example, not a captured live agent
session or a new benchmark result. The image contains only repository content.

To reproduce it with Chrome, run from the repository root:

```sh
google-chrome --headless --disable-gpu --hide-scrollbars \
  --window-size=1600,1060 --force-device-scale-factor=1 \
  --screenshot="$PWD/assets/screenshots/signup-example.png" \
  "file://$PWD/assets/screenshots/signup-example.html"
```

The Codex manifest references the PNG; keep the image inside the plugin bundle.
