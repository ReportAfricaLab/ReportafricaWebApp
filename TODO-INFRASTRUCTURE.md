# Pending Infrastructure Tasks

## Step 7: Cloudflare Proxy ✅ COMPLETED

**Status:** DONE — `reportafrica.africa` on Cloudflare Free plan
- Domain active on Cloudflare ✅
- SSL/TLS Full (strict) ✅
- DDoS protection active ✅
- Bot fight mode enabled ✅
- Admin attack-mode toggle: `PATCH /api/v1/health/cloudflare/attack-mode` ✅
- Env vars: CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN configured ✅

---

## Step 9: Backup Hardening (PARTIALLY BLOCKED)

**RDS backup retention:** BLOCKED at 1 day (free tier limit — FreeTierRestrictionError)
**S3 versioning:** Already enabled ✅
**AMI backup:** Created 2026-06-12 (ami-0066c0976f0f4017f) ✅

**When budget allows:** Upgrade RDS to 7-day retention ($0 if still under 20GB backup, but requires paid account plan)

---

## Build Later — Product Features (Need users/traction first)

### Campus Journalism Network
- Campus-specific communities (mini-networks per university)
- Student reporter verification via school email or manual approval
- Campus-specific feeds and leaderboards
- **When:** After proving model works in 2-3 cities, demand from 3+ universities

### Calendar-Based Event Discovery
- Calendar view for upcoming events (protests, festivals, meetings, etc.)
- Date-based browsing and reminders
- **When:** After 50+ events per week per country

### Editorial Approval Queue (Human Editors)
- Human editor review workflow before publishing
- Editor role with dashboard
- **When:** When revenue supports hiring editors

### Paid Boosted Posts for Businesses
- Businesses pay to boost announcements to wider audience
- Geo-targeted promotion with budget controls
- **When:** After 50+ businesses registered on platform

### Creator/Reporter Rewards (Token System)
- TVcoin-like reward token for accurate reporting
- Earn tokens for verified reports, redeem for cash/airtime
- **When:** After sustainable revenue model proven. Tips + licensing already reward reporters.

### Report Drafts (Save as Draft)
- Allow reporters to save incomplete reports as drafts
- Resume editing later before submitting
- **When:** When reporters specifically request it. Current fast-submit flow works.

---

## Future Monetization Features (Build Later)

### Phase 2 — Build when 10k+ active users
| Feature | Revenue Model | Prerequisite |
|---------|--------------|---------------|
| Report-to-Earn (ad revenue split 60/40) | Ad revenue sharing | Need real advertisers paying first |
| Community Bounties (Solve-and-Earn) | 15% commission on bounty payouts | Need NGO/org partnerships |
| Telco Data Bundles for Reporters | Revenue share from MTN/Airtel | Business partnership deal |
| Micro-Insurance Referrals | Commission per policy sold | Partner with Leadway/AXA Mansard |

### Phase 3 — Build when data density is high
| Feature | Revenue Model | Prerequisite |
|---------|--------------|---------------|
| Civic Insight Risk API (Insurance/Logistics) | Monthly API subscription | 50k+ verified reports |
| Real Estate Livability Scores | B2B API licensing | Neighborhood-level data density |
| Political Sentiment Dashboard | Seasonal subscription | Election cycle timing |
| Credit Scoring Alternative Data (Fintechs) | Fee per credit check | Regulatory approval + trust data |
| Government Response Dashboard (full SaaS) | Annual license per LGA | Sales team + gov relationships |

### Phase 4 — Long-term
| Feature | Revenue Model | Prerequisite |
|---------|--------------|---------------|
| Urban Planning Consulting Data | Project fees | Massive dataset |
| Retail Site Selection Analytics | Data subscription | Years of data |
| CSR Impact Dashboards | Management fees | Corporate sales |
| Supply Chain Brand Watch | Monthly retainer | Brand partnerships |
| White-Label Licensing | Licensing + maintenance fees | Product maturity |
| Fix-It Contractor Marketplace | 5-10% commission | Contractor vetting |
| Legal Aid Connect | Lead gen fees | Lawyer network |
| Event Coverage Channels | One-time fee per event | Event org partnerships |
