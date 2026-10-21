---
name: sky-consumer-ux-standards
description: Sky consumer interaction patterns for the core customer journeys (sign in, home, bills and payments, service status, Sky Mobile data usage and add-ons, help), plus error, form, loading and copy standards. Use before building or changing any Sky user flow.
---

# Sky consumer UX standards

## Core journeys

### Sign in (Sky iD)
- Fields: username (Sky iD / email), password with show/hide. Primary "Sign in". Tertiary "Forgotten your details?".
- Empty submission shows one inline message under the fields: **"Enter your username and password."** The button is never disabled.
- Wrong credentials: **"That username or password doesn't look right. Try again or reset your password."** Never say which one is wrong.
- Biometric unlock is offered after the first successful sign in, via a bottom sheet, never a system alert on launch.

### Home
- Greeting `title1`: "Hi {first name}". Then `SkyBillCard`, then "Your services" (`SkyServiceRow` per product in order TV, Broadband, Mobile, Protect), then "Offers" carousel.
- A service row always shows a live status: Connected / Active / No issues, or a warning chip linking to Service status.

### Bills & payments
- Amount in `money` style, "Due {d MMM}". If a payment is scheduled: "We'll take £92.50 on 28 Oct". If overdue: warning banner, never red text on the amount alone.
- "Pay bill" opens a bottom sheet: amount (editable, GBP), saved card, primary "Pay £92.50". Success state is a full-sheet tick + "Payment taken" + reference.

### Service status
- Rows per product with `SkyStatusChip`: "No issues" (success) / "Slower than usual" (warning) / "Not working" (error) + "We're fixing it" copy and an ETA when known.

### Sky Mobile
- Data: `SkyUsageRing` "12 GB of 25 GB used", renews date, Piggybank balance "18 GB saved" with "Use Piggybank" tertiary action.
- Roll / Mix / Swap are product names: capitalised, each a `SkyCard` with one-line explanation and a tertiary action.
- Add-ons: "Buy a data add-on" primary opens a sheet with radio options (`1 GB — £5`, `5 GB — £10`, `Unlimited — £15`), line picker if more than one line, primary "Buy {option}". Success: tick + "Add-on added" + "It'll be ready to use in a few minutes".

### Help
- Order: search, "Chat to us" (primary), service status rows, FAQ accordion. Chat shows waiting time when known.

## Forms
- Labels above fields, helper text below. Validate on blur and on submit; messages inline in `callout` + `sky.colour.error` with an icon.
- Submit buttons stay enabled; on submit, show a loading state in the button ("Buying…") and lock the fields.
- Money inputs: numeric keypad, "£" prefix, two decimals.

## Errors
- Pattern (`SkyBanner/error`): title in plain English, one sentence on what to do, Reference ID.
  - Title: **"Something went wrong"** (generic) / **"We couldn't take that payment"** / **"We couldn't add that add-on"**.
  - Body: **"Try again in a few minutes. If it keeps happening, chat to us and quote the reference below."**
  - Footer: **"Reference ID: {correlationId}"** — equal to the request correlation ID so support and engineering can trace it.
- Never show HTTP status codes, stack traces or server messages. Never clear the customer's input on error.
- Offline: full-screen "You're offline" with a retry action; cached data stays visible with a "Last updated" caption.

## Loading & empty states
- Skeletons for cards and rows (never spinners for content); spinners only inside buttons.
- Empty states have an illustration-free icon tile, one sentence, one action ("You don't have any add-ons yet" / "Buy a data add-on").

## Copy (tone of voice)
- British English, sentence case, contractions welcome, second person. No exclamation marks, no "Oops", no "Please" at the start of instructions.
- Numbers: `£92.50`, `28 Oct`, `12 GB`, `900 Mb/s`, `07700 900123` (grouped 5+6).
- Words we use: "bill" not "invoice"; "add-on" not "bolt-on"; "chat to us" not "contact support"; "sign in" not "log in"; "Sky iD" (lower-case i, capital D).
