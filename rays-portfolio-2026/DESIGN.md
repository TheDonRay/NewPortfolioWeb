---
name: Rayat Chowdhury Portfolio
description: Night Signal. A black stage, a live field behind it, one blue signal.
colors:
  void: "#000000"
  panel: "#111317"
  line: "rgba(255, 255, 255, 0.12)"
  line-hi: "rgba(255, 255, 255, 0.26)"
  ink: "#f2f3f5"
  soft: "#c4c8ce"
  mute: "#9aa0a8"
  dim: "#7a8089"
  signal: "#3d7bff"
  signal-hi: "#6f9dff"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.4rem, 10.2vw, 10.75rem)"
    fontWeight: 500
    lineHeight: 0.86
    letterSpacing: "-0.04em"
    fontFeature: "ss01"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(3rem, 9.5vw, 8.75rem)"
    fontWeight: 500
    lineHeight: 0.82
    letterSpacing: "-0.04em"
    fontFeature: "ss01"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.375rem, 2.4vw, 2rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.03em"
    fontFeature: "ss01"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.125rem, 1.6vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "ss01"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    fontFeature: "ss01"
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.3
    fontFeature: "ss01"
  caption:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.3
    fontFeature: "ss01"
rounded:
  focus: "6px"
  panel: "20px"
  pill: "999px"
spacing:
  gut: "clamp(1rem, 4.5vw, 4.5rem)"
  stack: "clamp(6rem, 14vh, 11rem)"
  rail: "1440px"
  nav-h: "4.25rem"
components:
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.void}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1.25rem"
    height: "2.75rem"
  button-solid-hover:
    backgroundColor: "#ffffff"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1.25rem"
    height: "2.75rem"
  button-outline-hover:
    backgroundColor: "rgba(255, 255, 255, 0.06)"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.soft}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.9rem"
  tag-small:
    backgroundColor: "transparent"
    textColor: "{colors.soft}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.85rem"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.panel}"
    padding: "clamp(1.5rem, 4vw, 3.25rem)"
  nav-link:
    textColor: "{colors.mute}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.95rem"
  nav-link-active:
    backgroundColor: "rgba(255, 255, 255, 0.09)"
    textColor: "{colors.ink}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "44px"
---

# Design System: Rayat Chowdhury Portfolio

## Overview

**Creative North Star: "Night Signal"**

The page is a dark broadcast frame. A true-black stage carries a live, canvas-drawn field of dotted flow lines that bow around an elliptical lens, with a few blue sparks riding them; enormous uppercase type is set over it, split across the frame. Everything else is small, quiet and sentence case, so the poster-scale words and the field do all the shouting.

Density is low and deliberate: one wide rail, generous vertical stacking between sections, structure drawn with hairlines rather than boxes. Raised graphite panels appear only where a block of content needs to be held together (the education card, the project slide, the calendar placeholder). The single colour of the system is one signal blue, and it is rationed to light-like roles: sparks in the field, the breathing status dot, focus and selection.

The system rejects the white card-grid portfolio and the centred headline-over-cards hero.

**Key Characteristics:**
- True black stage (#000) with graphite panels; no light surfaces anywhere.
- One family, Geist: uppercase medium display at poster scale, tight negative tracking; small sentence-case UI.
- One blue signal, used as light, never as fill.
- 1px hairlines at 12% white as the structural device; no shadows.
- Pills and circles for every control; 20px panels for every container.
- A live generative field behind the hero and, quieter, behind the closing contact section.

## Colors

A near-monochrome night palette of black, graphite and four steps of cool ink, lit by a single electric blue.

### Primary
- **Signal Blue** (`{colors.signal}`): the field's sparks, the breathing status dot (in the "Book a call" pill and the "Now" badge on the current job), and text selection background. It is light in the scene, not paint.
- **Signal Blue, Lit** (`{colors.signal-hi}`): the 2px focus ring and the hover underline on the contact email. The brighter step exists so blue reads on black at small sizes.

### Neutral
- **Void** (`{colors.void}`): the page, the open mobile menu, and the text on solid pills.
- **Graphite Panel** (`{colors.panel}`): the only raised surface: education card, project slide, calendar placeholder.
- **Hairline** (`{colors.line}`): every divider, panel border, chip and quiet capsule border.
- **Hairline, Raised** (`{colors.line-hi}`): outlines on interactive things (outline pills, icon buttons, carousel dots at rest, underline at rest).
- **Ink** (`{colors.ink}`): headlines, primary labels, the solid pill fill, hover target for text and borders.
- **Soft Ink** (`{colors.soft}`): body prose, intros, bullets, chip text.
- **Mute Ink** (`{colors.mute}`): secondary metadata, nav links at rest, section asides, footer.
- **Dim Ink** (`{colors.dim}`): bullet dashes and the de-emphasised half of the carousel count. Never for running text.

### Named Rules
**The One Signal Rule.** Blue appears only as light: field sparks, the status dot, focus rings, selection, and the contact email's hover underline. It never fills a button, never colours a heading or body copy, and no second accent exists.

**The Black Stage Rule.** The page is #000 end to end. Depth comes from the graphite panel and the hero's graphite floor glow, never from a light section or a tinted band.

## Typography

**Display Font:** Geist (with ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Geist, same stack
**Label/Mono Font:** none; Geist throughout, with tabular numerals for dates and counts.

**Character:** One grotesk carrying two voices: monumental uppercase capitals at medium weight with tight tracking, and small, calm sentence-case UI. Stylistic set `ss01` is on globally; weights loaded 300 to 700, used at 400 and 500 (600 only in the monogram).

### Hierarchy
- **Display** (500, `{typography.display}`, line-height 0.86, -0.04em, uppercase): the hero name only, split across two lines with the second right-aligned.
- **Headline** (500, `{typography.headline}`, line-height 0.82, -0.04em, uppercase): section titles (About, Skills, Experience, Projects, Book a call). The contact head uses the same voice at clamp(2.6rem, 8.6vw, 8.5rem) with a 13ch measure.
- **Title** (500, `{typography.title}`, line-height 1.05, -0.03em): job roles and About sub-heads. Project names run larger (clamp(1.75rem, 7.2vw, 4.75rem), line-height 0.9) in source case.
- **Lead** (400, `{typography.lead}`, 1.5): project blurbs, the book-a-call and contact sub-copy.
- **Body** (400, `{typography.body}`, 1.65): prose at 64 to 68ch.
- **Label** (500, `{typography.label}`): pills, nav links, project links, carousel count.
- **Caption** (400, `{typography.caption}`): stack tags and the "Now" badge.

### Named Rules
**The Poster Voice Rule.** Only headings speak in capitals, and when they do they are huge: uppercase, weight 500, -0.04em, line-height at or under 0.86. Everything below title scale stays sentence case. Project names keep their source casing so compound names keep their word boundaries.

**The One Family Rule.** Geist only. Hierarchy comes from scale and case, never from a second typeface or heavy weights.

## Layout

A single centred rail (`{spacing.rail}` max) with fluid side gutters (`{spacing.gut}`). Sections stack with `{spacing.stack}` of vertical padding. The fixed nav is `{spacing.nav-h}` tall and anchors scroll with that clearance.

Every section opens with a head: the poster-scale title on one side and a short mute aside (max 24ch) on the other, closed by a hairline. Heads alternate sides (About, Experience, Book a call left; Skills, Projects right) to echo the split hero name. Under 640px the head stacks with the aside left-aligned.

Content below heads is a two-column spec layout: a fixed 15rem label column and a fluid content column, one hairline between rows (Skills, Experience). About uses a 7:4 split with a sticky graphite card. The hero is full-height (100svh): name at the top, a hairline-topped foot band with intro left (46ch) and pill actions right.

Breakpoints observed: 1100px (scroll cue hides), 900px (nav collapses to Menu pill, About single column, hero caption goes static), 860px (project slide stacks), 760px (job rows and hero foot stack), 700px (spec rows stack), 640px (section heads stack), 520px (nav name hides).

## Elevation & Depth

Flat. No surface carries a box-shadow. Depth comes from three things: the graphite panel against black, the hero's radial graphite floor (a dim glow rising from below the frame), and the live field behind the type. The nav gains a translucent black glass with 16px blur once the page scrolls, and its link capsule sits on a 12px blur; that is the only translucency in the system.

### Shadow Vocabulary
- **Signal pulse** (`box-shadow: 0 0 0 0.55rem rgba(61, 123, 255, 0)` animated from `0 0 0 0 rgba(61, 123, 255, 0.55)`): the breathing ring on the status dot, 2.8s loop. The only shadow, and it is light, not elevation.

### Named Rules
**The Hairline Rule.** Structure is drawn, not lifted: 1px lines at 12% white divide and contain; 26% white outlines anything clickable. If something needs separating, add a hairline, not a shadow.

## Shapes

Two shapes and nothing in between. Controls are fully rounded: pills (999px) for buttons, chips, tags, nav links and the nav capsule; circles for the monogram, icon buttons, scroll cue and status dot. Containers are 20px-radius panels (`{rounded.panel}`): project slide, carousel viewport, education card, calendar frame. The focus ring rounds at 6px. Bullets are 0.6rem horizontal dashes, not dots.

**The Pill Rule.** A control is a pill or a circle; a container is a 20px panel. No square buttons, no 4 to 12px "card" radii.

## Components

### Buttons
Quiet, confident pills.
- **Shape:** fully rounded (`{rounded.pill}`), min-height 2.75rem.
- **Solid:** ink fill, void text, label type; hover brightens to pure white. One per group, carrying the primary action ("See my work").
- **Outline:** transparent with a raised hairline; hover turns the border ink and adds a 6% white wash.
- **With status dot:** the nav "Book a call" pill leads with the breathing signal dot on a translucent black fill; active state turns its border ink.
- **Focus:** 2px signal-lit outline, 3px offset.
- **Transitions:** 0.2 to 0.25s on the system ease.

### Chips
- **Style:** transparent, 12% hairline border, soft-ink label at 0.875rem (skills) or 0.8125rem tags (project stack).
- **State:** hover raises the border to 26% and the text to ink. Chips are not selectable.

### Cards / Containers
- **Corner Style:** 20px.
- **Background:** graphite panel.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px hairline.
- **Internal Padding:** clamp(1.5rem, 4vw, 3.25rem) on the project slide; clamp(1.5rem, 3vw, 2.25rem) on the education card. Internal rows divide with hairlines.

### Navigation
- **Desktop:** three-column bar: ink monogram circle and name left; section links centred in a hairline capsule on blurred translucent black; resume text link and the dot pill right. Links rest in mute, hover to ink, active gets a 9% white pill fill. The bar is transparent over the hero and lifts to blurred black glass with a bottom hairline on scroll.
- **Mobile (under 900px):** capsule and resume hide; a "Menu" pill with a two-bar glyph toggles a full-screen black menu whose links are set in the poster voice (uppercase, clamp(2.1rem, 10.5vw, 3.75rem), -0.04em) and divided by hairlines.

### Project Carousel
A single graphite slide at a time: large source-case project name and pill links across the top over a hairline, blurb (lead) and dashed points side by side, stack tags along the bottom. Controls above: tabular count, dots that stretch from 8px to a 20px ink bar when current, and 44px circular outline arrows.

### Signal Field (signature)
A 2D canvas of 1.4px dots on rows of flow lines bending around a central elliptical lens, brightest at the lens rim and fading toward the edges and the bottom copy band; about 3% of dots become blue spark dashes that twinkle. The pointer parts the lines with an eased vertical push. It fades and settles in over 2.4s on load, pauses offscreen, and renders one still frame under reduced motion. It returns behind Contact at 55% intensity, masked top and bottom.

### Motion
One load sequence, then stillness: hero name lines rise out of their masks (1.25s, second line 0.15s later), the caption and foot band fade up after. All transitions use `cubic-bezier(0.16, 1, 0.3, 1)`. Reduced motion collapses every animation and transition.

## Do's and Don'ts

### Do:
- **Do** keep the page on #000 and hold grouped content in a single graphite panel with a 12% hairline and 20px radius.
- **Do** set section titles in the poster voice: uppercase Geist 500, -0.04em, line-height 0.82 to 0.86, with a short mute aside on the opposite side and a hairline beneath.
- **Do** ration Signal Blue to sparks, the status dot, focus, selection and the email hover underline.
- **Do** use pills for every control: solid ink for the one primary action, outline for the rest.
- **Do** use 1.5-stroke line icons at 16 to 18px, inline, in the text colour.
- **Do** divide lists and spec rows with 1px hairlines and mark bullets with short horizontal dashes.

### Don't:
- **Don't** add a second accent colour or fill a button or heading with blue.
- **Don't** introduce light sections, white cards or a card grid.
- **Don't** use box-shadows for elevation; separate with hairlines and the graphite panel.
- **Don't** set small labels in uppercase or stack an eyebrow/kicker label above a section title; the aside beside the title is the only secondary heading device.
- **Don't** introduce a second typeface or weights above 500 for headings.
- **Don't** use intermediate corner radii; it is a pill, a circle, or a 20px panel.
