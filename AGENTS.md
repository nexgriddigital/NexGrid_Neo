# UI/UX Pro Max - Agent System Instructions

This workspace is integrated with **UI/UX Pro Max v2.0** (`nextlevelbuilder/ui-ux-pro-max-skill`).
All design and implementation decisions must follow these principles and intelligence rules.

---

## 1. Design Intelligence Architecture

- **192 Industry-Specific Reasoning Rules**: Matches product category to recommended pattern, style priority, color mood, typography, key effects, and anti-patterns.
- **79 Searchable UI Styles (50 active)**: Modern styles including Bento Grid, Glassmorphism, Swiss Minimalism, AI-Native, Dark Mode, Neo-Brutalism, Claymorphism, Aurora UI, etc.
- **192 Color Palettes**: Hand-tuned, high-contrast accessible tokens with WCAG AA compliance (text contrast >= 4.5:1).
- **74 Curated Font Pairings**: High-character display headings paired with highly legible body typography.
- **119 UX Guidelines & Anti-Pattern Rules**: Layout resilience, form validation, error states, and responsive patterns.
- **22 Tech Stacks**: Detailed guidelines for React 19, Tailwind CSS v4, Motion, Next.js, and more.

---

## 2. CLI & Python Search Engine

The UI/UX Pro Max engine is installed in `.gemini/skills/ui-ux-pro-max/` and `.agents/skills/ui-ux-pro-max/`.
Run queries using the standard Python 3 search script:

```bash
# Generate complete design system for a product
python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry>" --design-system -p "Project Name"

# Generate with JSON output
python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --json

# Persist to design-system/<slug>/MASTER.md
python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"

# Domain-specific searches
python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain style
python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain color
python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain typography
python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain chart
python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux

# Stack-specific best practices
python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<topic>" --stack react
python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<topic>" --stack html-tailwind
```

---

## 3. Strict Pre-Delivery Checklist

Before completing any UI/UX task, verify:
- [ ] **No emojis as icons**: Use vector icons (`lucide-react`) exclusively.
- [ ] **Cursor pointer**: `cursor-pointer` explicitly added to all clickable elements.
- [ ] **Keyboard accessibility**: Visible focus states (`focus-visible:ring-2`) and keyboard navigation support.
- [ ] **Contrast**: WCAG AA verified (4.5:1 text contrast).
- [ ] **Compact labels**: Buttons, pills, chips, and tabs must have `whitespace-nowrap` to prevent awkward wrapping.
- [ ] **Anti-patterns banned**: No generic AI purple-pink gradients unless explicitly appropriate for Web3/Cyberpunk.
- [ ] **Mathematical spacing**: Inner corner radius = outer radius - padding.
