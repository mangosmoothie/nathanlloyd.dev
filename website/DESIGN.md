---
version: "1.0"
name: "Nathan Lloyd Personal Brand"
description: "Professional, trustworthy, minimalist portfolio for a veteran Full Stack Cloud & AI Developer based in Colorado."
audience: "Business owners, technical leaders, and teams seeking secure AI and cloud solutions."
tone: "Authoritative yet approachable, calm confidence, practical leadership."

# Brand Principles
principles:
  - "Clarity over cleverness"
  - "Trust through simplicity and substance"
  - "Colorado-inspired calm strength"
  - "Results-focused minimalism"
  - "Security and privacy as visible values"

# Design Tokens
colors:
  primary: "#0F766E"           # Teal-700 - Trust, professionalism, mountain lake
  accent: "#D97706"            # Amber-600 - Warm Colorado energy
  background:
    light: "#F8FAFC"
    dark: "#0F172A"
  text:
    primary: "#1E2937"
    secondary: "#64748B"

typography:
  heading:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 700
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 400

spacing:
  base: 4
  scale:
    none: 0
    xs: 4
    sm: 8
    md: 12
    lg: 16
    xl: 24
    xxl: 32
    xxxl: 48
    huge: 64

borderRadius:
  default: "16px"
  large: "24px"

shadows:
  card: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
---

# DESIGN.md – nathanlloyd.dev

## Overview
A clean, professional, minimalist single-page portfolio website

## Visual Identity & Atmosphere
- **Overall Feel**: Calm, confident, and grounded — like a clear Colorado mountain morning.
- **Personality**: Professional who gets things done without unnecessary complexity.
- **Color Story**: Deep teal (trust and nature) with warm amber accents (sunrise energy). Dark mode support for modern developer appeal.

## Typography
- Clean, highly readable sans-serif (Inter).
- Generous hierarchy and whitespace.
- Headlines are strong but never shouty.

## Layout & Components
- **Hero**: Split layout on desktop (headline and rounded headshot with two floating proof chips) over the Rocky Mountains photo with drifting mist.
- **Proof bar**: Card overlapping the hero with four metrics and the enterprise logos.
- **Work**: Product cards with an illustrative UI mock, status badge (Live / Launching soon), outcomes and stack chips.
- **Sections**: Left-aligned eyebrow, heading and lead; card-based services grid; experience timeline with a sticky summary column.
- **Navigation**: Sticky top nav with dark-mode toggle, call-to-action button and a compact menu on mobile.
- **Buttons**: Rounded, high contrast, clear CTAs.
- **Icons**: Self-hosted SVG sprite (`public/icons.svg`); no third-party CDNs.
- **Type**: Inter Variable, self-hosted.

## Key Pages / Sections
- Hero (main and supporting taglines)
- Proof bar (metrics and enterprise logos)
- Work (Adventure Guide, Social Media Manager, bmail, bizops)
- Services (AI-first cards)
- Experience (timeline, honors, education, resume download)
- About (professional and personal blend)
- Contact (Calendly, email and form)

## Do's and Don'ts

**Do:**
- Emphasize security, data ownership, and privacy
- Use real metrics and business outcomes
- Show warmth and approachability (family / Colorado elements)
- Keep text concise and benefit-focused

**Don't:**
- Overuse technical jargon
- Make it look like a generic corporate site
- List programming languages as primary selling points
- Overload the hero with too much text

## Future Extensions
- Blog section for AI/cloud thought leadership
- Case studies with more detail
- Testimonials (when available)
