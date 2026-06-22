# RepoShield Project Rules & Guidelines

These project rules ensure fast, regression-free code execution, keeping layout updates, themes, and print behaviors perfectly synchronized.

## Core Architecture & Selectors
- **Business Names**: Dom elements representing the business name capsule use class `.biz-title-placeholder` (typically inside `.standee-header h2`). Do NOT overwrite this with the custom flyer headline.
- **Headline Text**: Custom flyer headlines must strictly target `.standee-body h3` (not the general h2 tags in headers).
- **Campaign Config Scope**: Campaign styling data includes `theme`, `font`, `logo`, `qrSettings` (`qrDotStyle`, `qrCornerStyle`), and `flyerSettings` (`flyerHeadline`, `flyerSub`, `flyerFooter`, `flyerTextStyle`).

## Live Simulators & Iframes
- **No Keystroke Reloads**: Never dynamically reassign iframe `src` URLs on text input changes or keystrokes. This causes page flicker, resets states, and drops payload messages.
- **Iframe Initialization**: Set the iframe `src` once during initial page load or when the campaign type (`gmb`, `ecommerce`, `delivery`) changes.
- **Real-time Sync**: Apply all text, color, font, and theme changes instantly using window `postMessage` (`type: 'UPDATE_FLYER'`). 

## Printing & Styling Guidelines
- **Print Media Queries**: Ensure `@media print` CSS rules preserve theme backgrounds, gradients, and images. Use `-webkit-print-color-adjust: exact !important` and preserve cover image URLs instead of flattening them to flat white.
- **Template Parity**: Any changes made to the HTML/CSS template structures in `flyer.html` must be manually aligned inside the JavaScript printing loop of `bulk_flyer.html`.
