# iHotel 4.0

Монголын зочид буудлын удирдлагын систем — monorepo.

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Mobile**: Expo SDK 54, Expo Router, React Native
- **Web**: Next.js 16 App Router, Tailwind CSS
- **Language**: TypeScript strict mode

## Бүтэц

```
newihotel/
├── apps/
│   ├── mobile/          # Expo React Native app
│   └── web/             # Next.js web app
├── packages/
│   ├── config/          # Design tokens, constants
│   ├── types/           # TypeScript interfaces
│   ├── api/             # Mock-first API layer
│   ├── hooks/           # Shared React hooks
│   └── ui/              # Shared UI components
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## Эхлүүлэх

```bash
# Dependencies суулгах
pnpm install

# Бүх app-ыг зэрэг ажиллуулах
pnpm dev

# Зөвхөн mobile
pnpm --filter mobile dev

# Зөвхөн web
pnpm --filter web dev
```

## Shared Packages

| Package | Тайлбар |
|---------|---------|
| `@ihotel/config` | Design tokens (colors, radius, fonts) |
| `@ihotel/types` | TypeScript interfaces (Hotel, Room, Guest, ...) |
| `@ihotel/api` | Mock-first API layer (100+ Mongolian hotels) |
| `@ihotel/hooks` | React hooks (useDebounce, ...) |
| `@ihotel/ui` | Button, Card components |

## Mock Data

`packages/api/mock/generators.ts` — 100+ бодит Монгол буудлын нэртэй mock data:
- Edge cases: 0 review, 500 review, маш урт Cyrillic нэр
- `USE_MOCK = true` → бүх API дуудлага mock-оос ирнэ
