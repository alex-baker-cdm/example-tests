---
trigger: always_on
description: Mandatory Sky consumer UX guardrails for any customer-facing UI change.
---

## Sky consumer UX guardrails (always apply)

- Use only the tokens in `skills/sky-design-system` (`sky.colour.*`, `sky.type.*`, `sky.space.*`, `sky.radius.*`). No hard-coded hex values, font sizes or spacing in UI code. The Sky gradient is a brand asset: hero and primary-CTA use only, never as body background or text fill.
- Every screen has exactly one primary action, rendered as a Sky pill button (`SkyButton/primary`). Destructive actions (Cancel plan, Sign out, Remove line) are never the primary action and always confirm.
- Money is shown in GBP with pence (`£92.50`, never `£92.5` or `GBP 92.50`), dates as `28 Oct` / `28 October 2026`, data as `12 GB of 25 GB` (space before the unit, decimal only below 1 GB: `750 MB`).
- Errors never show stack traces, HTTP codes or raw server messages. Use the error pattern in `skills/sky-consumer-ux-standards` (plain-English title, what to do next, a Reference ID equal to the request correlation ID). Validation errors are inline, next to the field, and never disable the submit button.
- Accessibility floor is WCAG 2.2 AA: 4.5:1 text contrast (3:1 for large text and icons), minimum 44x44 pt / 48x48 dp touch targets, every interactive control has an accessible label, every screen announces its title, no information carried by colour alone, respects reduced motion and Dynamic Type / font scaling up to 200%.
- Copy is British English, sentence case, second person ("Your next bill"), no exclamation marks, no jargon ("Roll", "Mix", "Swap", "Piggybank" are product names and keep their capitalisation). Never say "error", "invalid" or "failed" to a customer.
- Feature parity: a customer-facing feature ships to iOS, Android and web together with identical copy, data and behaviour. Platform-specific implementation is fine; platform-specific behaviour is a defect.
- Every UI PR includes screenshots (light and dark where supported) and names the SKY-UX rule IDs it was checked against.
