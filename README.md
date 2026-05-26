# ReportAfrica

Africa's Citizen-Powered Live Reporting Platform.

## Architecture

```
reportafrica/
├── apps/
│   ├── api/          # NestJS backend (TypeScript)
│   ├── web/          # Next.js web app (TypeScript + Tailwind)
│   └── mobile/       # React Native mobile app (Expo)
├── packages/
│   └── shared/       # Shared types, constants, utilities
├── docker-compose.yml
└── turbo.json
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native (Expo) |
| Web | Next.js + Tailwind CSS |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + PostGIS |
| Cache | Redis |
| File Storage | AWS S3 |
| Livestreaming | AWS IVS |
| Maps | Mapbox |
| Payments | Paystack |
| Notifications | Firebase Cloud Messaging |

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm 9+

### Setup

1. Clone and install dependencies:
```bash
npm install
```

2. Start infrastructure (PostgreSQL + Redis):
```bash
docker-compose up -d
```

3. Configure environment:
```bash
cp apps/api/.env.example apps/api/.env
```

4. Run all apps in development:
```bash
npm run dev
```

Or run individually:
```bash
npm run dev:api    # Backend on :3001
npm run dev:web    # Web on :3000
npm run dev:mobile # Expo mobile
```

## API Endpoints (v1)

### Auth
- `POST /api/v1/auth/register` — Register new user
- `POST /api/v1/auth/login` — Login

### Users
- `GET /api/v1/users/me` — Get profile (auth required)
- `PATCH /api/v1/users/me` — Update profile (auth required)

### Reports
- `POST /api/v1/reports` — Create report (auth required)
- `GET /api/v1/reports/feed?country=NG&page=1` — Country feed
- `GET /api/v1/reports/nearby?lat=6.5&lng=3.3&radius=10` — Nearby reports
- `GET /api/v1/reports/category/:category?country=NG` — By category
- `GET /api/v1/reports/:id` — Single report
- `PATCH /api/v1/reports/:id/upvote` — Upvote (auth required)
- `PATCH /api/v1/reports/:id/downvote` — Downvote (auth required)

## Development Phases

- [x] Phase 1 — Foundation (monorepo, auth, reporting, feed, maps)
- [ ] Phase 2 — AI & Trust (moderation, verification, trust scores)
- [ ] Phase 3 — Community Helping Hands (donations, campaigns)
- [ ] Phase 4 — Enterprise (media licensing, government dashboards)
- [ ] Phase 5 — Continental Expansion (multi-region, languages)
