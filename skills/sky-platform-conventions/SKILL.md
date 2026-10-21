---
name: sky-platform-conventions
description: How the Sky Design System maps onto SwiftUI (iOS), Jetpack Compose (Android) and React (sky.com / My Sky web), the shared mock-data contract, and the cross-platform feature-parity checklist. Use when implementing a Sky feature on one platform or coordinating the same feature across iOS, Android and web.
---

# Sky platform conventions

## Where things live
- iOS: SwiftUI, iOS 17+, `ios/<App>/` with `project.yml` (XcodeGen). Tokens in `Theme/SkyTheme.swift` (`SkyColor`, `SkyFont`, `SkySpace`).
- Android: Kotlin + Jetpack Compose, minSdk 26, `android/` with `ui/theme/SkyTheme.kt` (`SkyColors`, `SkyTypography`, `SkySpace`).
- Web: React + TypeScript (Vite), `web/src/` with `theme/tokens.css` (CSS custom properties `--sky-colour-*`, `--sky-space-*`).
- Never inline a token value; add it to the theme file first on all three platforms.

## Component mapping

| Design system | SwiftUI | Compose | React |
|---|---|---|---|
| `SkyButton/primary` | `SkyPrimaryButton` (gradient `LinearGradient`, `.clipShape(Capsule())`) | `SkyPrimaryButton` (`Brush.horizontalGradient`, `CircleShape`) | `<SkyButton variant="primary">` |
| `SkyCard` | `SkyCard { }` view builder, `RoundedRectangle(16)` | `SkyCard(content)` `RoundedCornerShape(16.dp)` | `<SkyCard>` |
| `SkyBottomSheet` | `.sheet` + `.presentationDetents([.medium])` + `.presentationBackground(Color.white)` | `ModalBottomSheet` | `<SkySheet>` (dialog, focus-trapped) |
| `SkyUsageRing` | `Circle().trim` + `AngularGradient`, `.accessibilityValue` | `Canvas` arc + `semantics { stateDescription }` | SVG arc + `role="progressbar"` + `aria-valuetext` |
| `SkyTabBar` | `TabView` with `.tabItem` | `NavigationBar` + `NavigationBarItem` | `<nav aria-label="Primary">` |
| `SkyBanner/error` | `SkyBanner(kind: .error, referenceId:)` | `SkyBanner(kind = Error, referenceId)` | `<SkyBanner kind="error" referenceId>` `role="alert"` |

## Shared mock-data contract (demo builds)
Every platform ships the same demo account so screenshots and recordings match:
- Sky iD `alexbaker` / `Sky12345`; customer "Alex Baker"; next bill `£92.50` due `28 Oct`.
- Services: Sky Glass (Ultimate TV + Sky Sports), Sky Broadband Gigafast `900 Mb/s` Connected, Sky Mobile `07700 900123` `12 GB of 25 GB`, Sky Protect.
- Piggybank `18 GB saved`. Add-ons `1 GB £5`, `5 GB £10`, `Unlimited £15`.

## Platform-specific gotchas
- iOS 26: hide the navigation bar and render the Sky wordmark header in content (custom leading toolbar items get squeezed). Use `Locale(identifier: "en_GB")` for currency.
- Compose: wrap the app in `SkyTheme { }`; use `Modifier.semantics` on custom drawings; test with font scale 2.0 in the emulator.
- Web: `prefers-reduced-motion` disables gradient shimmer and carousel transitions; use `:focus-visible` with `--sky-colour-focus`.

## Feature-parity checklist (cross-platform PRs)
1. Same copy, same token names, same data values on all platforms.
2. Same entry point (tab/screen) and same number of steps.
3. Same success and error states, including Reference ID on errors.
4. Accessibility labels equivalent (VoiceOver, TalkBack, screen reader on web).
5. Screenshots of the same screen from each platform side by side in the PR.
6. One PR per platform repo/directory, cross-linked, all titled "<Platform>: <feature>".
