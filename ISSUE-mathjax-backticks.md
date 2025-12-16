# MathJax: LaTeX environments require backticks to render

## Problem

LaTeX environments like `\begin{bmatrix}` don't render without backticks, while simple expressions like `\int` work fine.

## Reproduction

In `tufte-features.md`:

**Works (no backticks):**
```markdown
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

**Doesn't work (no backticks):**
```markdown
$$
\begin{bmatrix} \alpha & \beta^{*} \\ \gamma^{*} & \delta \end{bmatrix}
$$
```

**Works (with backticks):**
```markdown
`$$ \begin{bmatrix} \alpha & \beta^{*} \\ \gamma^{*} & \delta \end{bmatrix} $$`
```

## Investigation

### Hypothesis 1: Escape characters
- `\b` might be processed as backspace by Hugo/Goldmark
- But `\i` in `\int` works, so this doesn't fully explain it

### Hypothesis 2: AMS package not loaded
- Tried adding explicit AMS package loading to MathJax config:
```javascript
MathJax = {
    loader: {load: ['[tex]/ams']},
    tex: {
        packages: {'[+]': ['ams']},
        ...
    }
};
```
- **Result**: Still didn't work without backticks

### Hypothesis 3: Hugo passthrough
- Tried adding passthrough configuration to `hugo.yaml`:
```yaml
markup:
  goldmark:
    extensions:
      passthrough:
        delimiters:
          block:
            - - "$$"
              - "$$"
          inline:
            - - "$"
              - "$"
        enable: true
```
- **Result**: Math rendered, but block math size shrunk to ~1/3
- Inline math size was unaffected
- Suggests passthrough wraps block/inline differently

## Current Workaround

Wrap LaTeX environments with backticks:
```markdown
`$$ \begin{bmatrix} ... \end{bmatrix} $$`
```

This renders inside `<code>` tag, which preserves backslashes.

## Environment

- Hugo: Extended version (SCSS support required)
- MathJax: 3.2.2 (CDN with local fallback)
- Theme: kizoo69/tufte

## TODO

- Investigate why backticks work (what does `<code>` preserve?)
- Find a solution that doesn't require backticks
- If using passthrough, fix the block math sizing issue
