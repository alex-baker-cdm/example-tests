---
name: sky-design-system
description: Sky Design System tokens (colour, typography, spacing, radius, elevation) and component catalogue for My Sky (iOS/Android), sky.com and Sky Glass/Stream companion UI. Use before building or changing any Sky customer-facing UI.
---

# Sky Design System ("Toolkit")

## Colour tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `sky.colour.brand.blue` | `#0072C9` | `#3399FF` | Links, selected tab, focus accents |
| `sky.colour.brand.navy` | `#0A1E3C` | `#0A1E3C` | App bar, dark hero backgrounds |
| `sky.colour.background.page` | `#F5F7FA` | `#0A1E3C` | Page background |
| `sky.colour.background.card` | `#FFFFFF` | `#14294F` | Cards, sheets |
| `sky.colour.text.primary` | `#0A1E3C` | `#FFFFFF` | Body text |
| `sky.colour.text.secondary` | `#4A5568` | `#B8C4D6` | Supporting text |
| `sky.colour.text.inverse` | `#FFFFFF` | `#FFFFFF` | Text on navy/gradient |
| `sky.colour.success` | `#1E8E3E` | `#4CC26A` | Connected, payment taken |
| `sky.colour.warning` | `#C77800` | `#FFB547` | Approaching limit, service degraded |
| `sky.colour.error` | `#C8102E` | `#FF6B6B` | Something went wrong, payment declined |
| `sky.colour.focus` | `#0072C9` | `#3399FF` | Focus ring |
| `sky.colour.divider` | `#E2E8F0` | `#2A3F66` | Separators |

Sky gradient (`sky.gradient.brand`): linear 90°, stops `#F6A700` 0%, `#E9007E` 35%, `#9000BB` 70%, `#0094FF` 100%. Allowed on: wordmark, hero band, primary pill button, data-usage ring fill. Not allowed on: body text, icons, page backgrounds, cards.

## Typography (`sky.type.*`)

Family: Sky Text (fallback: SF Pro on iOS, Roboto on Android, `"Sky Text", -apple-system, Segoe UI, Roboto, sans-serif` on web). Weights: Regular 400, Medium 500, Bold 700.

| Token | Size/Line | Weight | Use |
|---|---|---|---|
| `display` | 40/48 | Bold | Hero headline (web only) |
| `title1` | 28/34 | Bold | Screen title ("Hi Alex") |
| `title2` | 22/28 | Bold | Section header ("Your services") |
| `headline` | 17/22 | Medium | Card title, list row title |
| `body` | 17/24 | Regular | Body copy |
| `callout` | 15/20 | Regular | Supporting copy |
| `caption` | 13/18 | Regular | Metadata, legal |
| `money` | 34/40 | Bold | Bill amount; tabular figures |

## Spacing, radius, elevation

- `sky.space`: 4, 8, 12, 16, 24, 32, 48. Screen gutter 16 (mobile) / 24 (tablet) / 80 max-width 1200 (web).
- `sky.radius`: `card` 16, `sheet` 24 (top corners), `pill` 999, `field` 12, `tile` 8.
- Elevation: cards use `sky.shadow.card` (0 2 8 rgba(10,30,60,0.08)); no shadows in dark mode, use `sky.colour.divider` 1 px border instead.

## Component catalogue

- `SkyButton` — variants `primary` (gradient fill, white text), `secondary` (navy outline), `tertiary` (text only). Pill radius, 48 height, full-width on mobile below 400 px, label is a verb ("Pay bill", "Buy add-on").
- `SkyCard` — white/dark card, 16 radius, 16 padding, optional leading icon tile (40x40, `tile` radius).
- `SkyServiceRow` — icon tile + title + subtitle + trailing status chip or chevron. Used for Sky Glass, Broadband, Mobile, Protect.
- `SkyStatusChip` — icon + text; `success` / `warning` / `error`; never colour-only.
- `SkyUsageBar` / `SkyUsageRing` — gradient fill, grey track, exposes "X GB of Y GB used, Z percent" to assistive tech. Warning colour at 90%.
- `SkyBillCard` — `money` amount, "Due 28 Oct" caption, two actions: primary "Pay bill", tertiary "View bill".
- `SkyOfferCarousel` — horizontally scrolling cards, 280 wide, page indicator dots, no auto-advance on mobile.
- `SkyBottomSheet` — 24 top radius, drag handle, title, body, single primary action; dismissible by swipe and close button.
- `SkyBanner` — inline notification above the form or at the top of the content, variants `success` / `error` / `info`; error variant shows Reference ID.
- `SkyTextField` — 12 radius, label above, helper/error text below in `callout`, 56 height.
- `SkyTabBar` — 4 or 5 tabs, icon + label, selected = `brand.blue`. My Sky tabs are fixed: Home, Mobile, Help, Account (TV tab when the customer has Sky Glass/Stream).
- `SkyTopBar` / wordmark header — Sky wordmark in gradient at top-left of the content area, 28 tall; no platform navigation bar title (hide the system bar and render the header in content).

## Iconography & imagery

- Icons: Sky Icons set (outline, 24, 1.5 stroke); fallback SF Symbols / Material Symbols outlined. Never mix filled and outlined on one screen.
- Service icons are fixed: TV = `tv`, Broadband = `wifi`, Mobile = `smartphone`, Protect = `shield`.
- Product imagery: Sky Glass/Stream renders on navy or gradient backgrounds, never on white.
