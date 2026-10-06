# Design analysis

Reference: https://www.vestrehabitats.com/ (inspected October 6, 2026, desktop Chrome at 1440 × 1000). Content source: https://www.farmnatura.in/.

## Visual system

Vestre uses deep green (#204116), pale green (#ecedd4), cream (#fffff2), muted sage (#c1c9a0) and yellow accent dots. Its desktop hero puts animated artwork on the left and centered 50px semibold headings on the right. Intro sections alternate text and organic image masks, with 40px section headings. Curved full-width boundaries link the sections. An ecosystem icon row leads into a pinned horizontal illustrated landscape. The lower page uses product columns, paired explanatory cards, stacked location links and a dark footer.

The reference uses proprietary Graphik fonts. This implementation uses freely licensed, locally hosted DM Sans with similar geometric proportions, rather than copying the font. The layout and motion are close adaptations; an exact reproduction is not claimed because Farm Natura requires different text and original artwork.

## Motion

The reference implementation uses GSAP ScrollTrigger, motion paths and Lottie artwork. Its horizontal illustration pans with scroll, pinning at the viewport center and using a 0.9-second scrub. Content reveals move vertically with easing; pollinators follow paths across the page.

Here GSAP handles staggered hero entrance, scroll reveals, continuous leaf/flower movement, bee motion paths and a pinned landscape with 0.9 scrub. Lenis provides smooth scrolling. SVG replaces Lottie so the original farmer, child, trees, flowers and landscape can be edited directly. Mobile uses a swipeable landscape, and reduced-motion users get static, accessible content.

## Section mapping

| Reference | Farm Natura |
| --- | --- |
| Biodiversity hero | Growing a life rooted in nature |
| Biodiversity introduction | Returning to the land and living soil |
| Urban biodiversity icons | Living soil, seeds, trees, pollinators, birdlife, flowers |
| Horizontal habitat illustration | Original orchard, vegetable beds, farmhouse, cows and family |
| Habitat photo strip | Interactive Farm Natura gallery |
| Product overview | Natural farming, orchards, farmhouse living, managed care |
| Designers | Natural farming approach and managed community |
| Visiting areas | Kandukur location and access |
| Experts/goals | Practical visitor FAQs |
| Dark closing section | Site visit invitation and contact footer |

## Content guardrails

Use Farm Natura’s own estate photography and published contact number. The 110+ acre statement, managed farming concept and location are sourced from its present website. Travel times are identified as approximate. No invented testimonials, pricing, available plots or booking confirmation. WhatsApp enquiry is handed to the visitor to send.
