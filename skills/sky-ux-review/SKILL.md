---
name: sky-ux-review
description: Sky UX review checklist with rule IDs (SKY-UX-001…) and blocking/advisory severity, used when reviewing or self-reviewing any PR that changes a Sky customer-facing UI.
---

# Sky UX review checklist

Review every UI PR against these rules. Comment with the rule ID (e.g. `SKY-UX-004`). Blocking rules must be fixed before merge; advisory rules may be deferred with a reason in the PR.

| ID | Rule | Severity |
|---|---|---|
| SKY-UX-001 | Only design-system tokens; no hard-coded colours, sizes or spacing | Blocking |
| SKY-UX-002 | Sky gradient used only on wordmark, hero, primary button, usage ring | Blocking |
| SKY-UX-003 | Exactly one primary action per screen or sheet | Blocking |
| SKY-UX-004 | Errors follow the Sky error pattern (plain title, next step, Reference ID); no HTTP codes or stack traces | Blocking |
| SKY-UX-005 | Validation is inline, submit button never disabled, input preserved on error | Blocking |
| SKY-UX-006 | WCAG 2.2 AA: contrast, 44/48 targets, labels on all controls, focus order, reduced motion | Blocking |
| SKY-UX-007 | Money/date/data formats (`£92.50`, `28 Oct`, `12 GB of 25 GB`) | Blocking |
| SKY-UX-008 | Feature parity across iOS, Android, web (copy, data, behaviour) | Blocking |
| SKY-UX-009 | Destructive actions confirm and are never primary | Blocking |
| SKY-UX-010 | Copy: British English, sentence case, no exclamation marks, approved vocabulary | Advisory |
| SKY-UX-011 | Skeleton loading for content, spinner only inside buttons | Advisory |
| SKY-UX-012 | Carousels do not auto-advance on mobile; page indicators present | Advisory |
| SKY-UX-013 | Dark mode supported and screenshotted where the platform supports it | Advisory |
| SKY-UX-014 | Service rows show live status chip (icon + text + colour) | Advisory |
| SKY-UX-015 | PR includes screenshots and lists the SKY-UX rule IDs checked | Advisory |

## How to review
1. Read the PR description and screenshots first; check SKY-UX-015.
2. Walk the diff per screen: tokens (001/002), actions (003/009), forms and errors (004/005), formats (007).
3. Run or reason about accessibility (006) — list what was checked.
4. For multi-platform features, open the sibling PRs and check 008.
5. Summarise: `Blocking: n · Advisory: n`, then the per-rule comments. Never pad a review with praise.
