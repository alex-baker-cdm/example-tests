---
trigger: model_decision
description: Apply when adding or changing any screen, component, animation, form, or media control in a Sky app or site.
---

## Sky accessibility rule set (WCAG 2.2 AA + Sky additions)

- Labels: every button, link, icon button, toggle, slider and image has a meaningful accessible label. Icon-only buttons get a label describing the action ("Buy a data add-on"), not the icon ("plus").
- Focus: visible focus ring on web (`sky.colour.focus`, 2 px, 2 px offset); logical focus order; focus moves to the sheet/dialog on open and returns on close.
- Targets: 44x44 pt iOS, 48x48 dp Android, 44x44 CSS px web, with 8 px minimum between adjacent targets.
- Motion: all non-essential animation (gradient shimmer, progress ring fill, carousel auto-advance) is disabled under reduced-motion settings; carousels never auto-advance on mobile.
- Text: supports Dynamic Type / font scale to 200% without truncation of money, dates or data figures; no text in images.
- Colour: status is always icon + text + colour (Connected = tick + "Connected" + `sky.colour.success`).
- Media: Sky Glass/Stream content tiles have alt text of the programme title; video controls are keyboard reachable; subtitles toggle is always visible.
- Screen readers: progress rings and usage bars expose value text ("12 GB of 25 GB used, 48 percent"); live regions announce success/error banners.
- Audit before PR: run the platform checker (Accessibility Inspector / Compose semantics tests / axe-core) and list results in the PR under "Accessibility".
