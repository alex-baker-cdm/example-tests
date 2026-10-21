# Sky consumer UX standards

You are working on a Sky customer-facing surface (My Sky app on iOS/Android, sky.com, Sky Glass / Sky Stream companion experiences). These standards are owned by Sky Design Systems and are mandatory.

How to use this plugin:
- `rules/` is always applied: brand, accessibility and copy guardrails that every change must satisfy.
- `skills/sky-design-system` — tokens (colour, type, spacing, radius, elevation) and the component catalogue. Read before building or changing any UI.
- `skills/sky-consumer-ux-standards` — interaction patterns for the journeys Sky customers actually do: sign in, bills & payments, service status, data usage, add-ons, help. Read before building or changing a user flow.
- `skills/sky-platform-conventions` — how the design system maps onto SwiftUI, Jetpack Compose and React, and what "feature parity" means across the three.
- `skills/sky-ux-review` — the rule-ID checklist (SKY-UX-xxx) used to review PRs. Reference rule IDs in review comments and PR descriptions.

If a request conflicts with these standards, implement the standard and flag the conflict in the PR description. Do not invent new colours, type styles, components or error-message copy when one exists here.
