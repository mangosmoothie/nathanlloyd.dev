---
version: "2.0"
name: "Nathan Lloyd Personal Brand — Midnight"
description: "Dark, precise, product-studio homepage for a veteran Full Stack Cloud & AI Developer who ships his own products."
audience: "Technical leaders, founders, and teams seeking secure AI and cloud solutions."
tone: "Confident, exact, engineer-to-engineer; calm rather than loud."

# Brand Principles
principles:
  - "Show shipped work first"
  - "Precision over decoration"
  - "Trust through substance and real metrics"
  - "Security and privacy as visible values"

# Design Tokens
colors:
  ink: "#08090C"               # Page background
  panel: "#0E1015"             # Cards, terminal, contact
  line: "rgba(255,255,255,0.10)"
  text:
    primary: "#F4F4F5"
    secondary: "#A1A1AA"
  accent:
    cyan: "#67E8F9"            # Links, kickers, icons
    violet: "#A78BFA"          # Gradient partner
  status:
    live: "#6EE7B7"
    soon: "#FDE68A"

typography:
  heading:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontWeight: 600
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"

borderRadius:
  default: "16px"
  large: "24px"
  pill: "9999px"
---

# DESIGN.md – nathanlloyd.dev

## Overview
A dark, single-page homepage that presents Nathan as a principal-level engineer who designs, builds and operates products end to end.

## Visual Identity & Atmosphere
- **Overall Feel**: Night-mode developer tool: near-black surfaces, hairline borders, one cyan-to-violet glow.
- **Personality**: Senior, exact, hands-on.
- **Color Story**: Neutral zinc text on ink; cyan for interaction, violet only in gradients; green and amber reserved for deployment status.

## Typography
- Geist for headings and body with tight tracking; Geist Mono for kickers, status, chips and the terminal.
- Self-hosted fonts and icons; no third-party CDNs.

## Layout & Components
- **Navigation**: Floating pill nav with call-to-action and a compact menu on mobile.
- **Hero**: Centered headline with gradient phrase, then a terminal window listing every deployment with live status.
- **Stats band**: Four hairline-divided metrics.
- **Work**: Split feature cards with illustrative UI mocks for live products; dashed cards for products shipping soon.
- **Capabilities**: Hairline grid of six cells plus a `stack.yml` block.
- **Experience**: Three-column rows (dates, role, outcomes), honors and education notes.
- **Contact**: Single glowing card with Calendly, email and the form.

## Key Pages / Sections
- Hero and deployments terminal
- Stats band and enterprise logos
- Work (Adventure Guide, Social Media Manager, bmail, bizops)
- Capabilities and stack
- Experience
- About
- Contact

## Do's and Don'ts

**Do:**
- Emphasize security, data ownership, and privacy
- Use real metrics and business outcomes
- Show warmth and approachability (family / Colorado elements)
- Keep text concise and benefit-focused

**Don't:**
- Add a second accent color outside status indicators
- Make it look like a generic corporate site
- Lead with programming languages; the stack block stays secondary
- Overload the hero with too much text

## Future Extensions
- Blog section for AI/cloud thought leadership
- Case studies with more detail
- Testimonials (when available)
