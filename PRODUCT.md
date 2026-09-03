# Product

## Register

product

## Users

Same two-audience shape as the other capstones: the student verifying their own
Terraform-provisioned stack actually works, and whoever they show it to afterward, an
interviewer or hiring manager glancing at a live link. Unlike the polling app this
replaced, this one has real content to look at: products, prices, categories, an actual
catalog, not three fields and a button. That content should do the visual work; nothing
here should need to be propped up with decoration.

## Product Purpose

Shopfront is a small curated storefront: browse a catalog, add items to a cart, place an
order. It exists as the starter app for the Infrastructure as Code capstone. The
application code is complete and untouched by the student; what they build is the entire
Terraform configuration that provisions the VPC, EC2 instance, and RDS database this app
runs on, plus a deployment mechanism (typically `user_data`) that gets it running with
zero manual console steps.

## Brand Personality

Curated and considered, like a small independent shop, not a big-box retailer and not a
flashy tech dashboard. Three words: composed, warm-neutral, confident. Quiet confidence
through real content and precise typography, not through visual effects.

## Anti-references

Explicitly not what the previous three attempts at this capstone's app (QuickPoll)
became: not a dark surface with a glowing neon accent and a pulsing "live" dot; that
read as a generic AI-dashboard cliche, not confidence. Not LinkDrop's coral or
Notekeep's sage; its own identity. Not the other AI-slop reflex this could easily fall
into instead: warm cream background with a serif display and a terracotta accent is
its own well-known cliche combination, avoid that exact recipe specifically. Not a
generic Shopify-template storefront (no giant hero banner, no carousel, no "Shop Now"
gradient button). Not glossy, corporate, or Amazon-scale; this is a small shop with
eight products, not a marketplace.

## Design Principles

- Content carries the design. Product names, prices, and categories are real material;
  lean on them instead of adding decoration to compensate for empty space.
- One coherent idea, executed with restraint, beats several half-realized ideas stacked
  together. If a design pass adds a second and third effect to make something feel
  finished, that's a sign the first idea wasn't resolved, not a reason to add a third.
  This was the specific failure mode that broke the QuickPoll rewrites: each pass added
  glow, gradient, and motion on top of the last instead of committing to one clear
  treatment.
- A grid is the right layout here because a catalog structurally needs one, not because
  it's a safe default; each of the other two capstones deliberately use a different
  structure (a form-and-feed for LinkDrop, a note grid for Notekeep) for the same reason.
- The cart and checkout should feel like a real, fast transaction: minimal friction,
  clear running total, no unnecessary steps.
- Distinct identity: its own palette and typography, not a reskin of the other two
  capstones or of QuickPoll's abandoned dark-mode direction.

## Accessibility & Inclusion

Standard baseline: WCAG AA contrast on all text and interactive elements, a fully
keyboard-operable interface (browse, add to cart, checkout all reachable via keyboard),
visible focus states, and motion that respects `prefers-reduced-motion`. No specific
additional requirements known.
