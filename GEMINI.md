# UI/UX Pro Max - Gemini System Context

This repository is configured with **UI/UX Pro Max v2.0** (`nextlevelbuilder/ui-ux-pro-max-skill`).

## Development Workflow
1. **Understand Intent**: Determine the product type, user demographic, and functional constraints.
2. **Apply Design Intelligence**: Use the UI/UX Pro Max knowledge base (`.gemini/skills/ui-ux-pro-max/`) to select appropriate design patterns, color tokens, and typography.
3. **Run Design System Query**:
   ```bash
   python3 .gemini/skills/ui-ux-pro-max/scripts/search.py "<product type>" --design-system --json
   ```
4. **Adhere to the Pre-Delivery Checklist**:
   - Vector icons only (from `lucide-react`)
   - `cursor-pointer` on all interactive elements
   - `whitespace-nowrap` on badges and chips
   - WCAG AA compliant color contrast
   - Resilient text reflow without layout shift
