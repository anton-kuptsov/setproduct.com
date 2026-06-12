# SEO baseline — dashboard pillar launch
**Snapshot date:** 2026-06-05
**Type:** Launch checkpoint
**Previous baseline:** .ai/seo-baseline-2026-05-28.md

## Launch facts
- Dashboard pillar deployed: 2026-06-05 (pushed to origin/main, HEAD `8e083a0`)
- Total commits in pillar project: 11 (`7721f18`..`8e083a0`)
- Initial engagement signal: 1 min average time on page (per author GA4 observation, day 1)

## What changed since Wave 1
- New pillar page created: /blog/dashboard-ui-design (hub of the cluster)
- 10 cluster posts linked to the pillar (callout + relatedSlugs + category "UI Design")
- 4 D-posts deprecated and removed (low-quality, subsumed by pillar)
- 4 permanent 301 redirects added in next.config.js
- 4 inbound links repaired (2 body links + 2 relatedSlugs), incl. fix of a self-redirect loop
- 14-post cluster now operates as a hub-and-spoke structure

## Posts to track (pillar + cluster)
| URL | Type | Pre-launch metric | Target | Check date |
|---|---|---|---|---|
| /blog/dashboard-ui-design | Pillar (new) | n/a | 1000+ impressions in 30 days | 2026-07-05 |
| /blog/dashboard-design-best-practices-... | 301 redirect source | 40,449 imp / 0.022% CTR | Impressions transfer to pillar >50% in 21 days | 2026-06-26 |
| /blog/marketing-dashboard-ui-design-guide | Consolidation target | 9,379 imp / 0.15% CTR | +30% impressions | 2026-07-05 |
| /dashboards | Conversion funnel | 1607 views / 30 KE | Inbound traffic from pillar (new referrer source) | 2026-06-19 |

## Success criteria (30-day evaluation)
- Pillar achieves 500+ impressions in GSC
- Old catastrophic URL impressions transfer >50% to pillar
- /dashboards conversion volume stays stable or grows
- No measurable drop in cluster posts' aggregate traffic

## Monitoring schedule
- Day 7: First reindexing check via GSC URL Inspection
- Day 14: First CTR data
- Day 21: Redirect transfer assessment
- Day 30: Full success criteria evaluation
