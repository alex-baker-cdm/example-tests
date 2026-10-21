# Sky consumer UX standards (Devin plugin)

Sky's proprietary UX context for customer-facing apps, packaged as a Devin plugin and distributed to every engineer's sessions as a required plugin.

```
.devin-plugin/plugin.json          plugin manifest
AGENTS.md                          how Devin should use this plugin
rules/sky-consumer-ux.md           always-on guardrails
rules/sky-accessibility.md         WCAG 2.2 AA + Sky additions (applied to UI changes)
skills/sky-design-system/          tokens + component catalogue
skills/sky-consumer-ux-standards/  journeys, forms, errors, copy
skills/sky-platform-conventions/   SwiftUI / Compose / React mapping, parity checklist
skills/sky-ux-review/              SKY-UX-001…015 review checklist
```

Install for the whole org: Customize → Plugins → Add from GitHub → `alex-baker-cdm/eng-standards`, mark as required. Or per repo in `.devin/config.json`.

Legacy example test guides live in `unit-tests/`, `ui-component-tests/` and `contract-tests/`.
