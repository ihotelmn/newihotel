# iHotel 4.0 — Claude Code Project Context

**Энэ файлыг `newihotel/PROJECT_CONTEXT.md` байршилд хадгалж, Claude Code session бүрийн эхэнд reference болгох.**

---

## 🎯 Нэг мөрөөр товчлоход

iHotel бол Монголын 800+ зочид буудалд утсаар захиалга хүлээж авах AI-первый mobile app — зочин "залгах" дарахад буудалд AI context автоматаар явдаг, pre-call alert-аар "иймээс залгаж байна" гэж мэдэгддэг.

---

## 🌏 Зах зээл ба context

### Манай улс

- **Орон нутаг:** Монгол (3.4 сая хүн, 21 аймаг)
- **Жуулчлалын зах зээл:** ~600k гадаад жуулчин/жил + ~1M дотоодын аялагч
- **Зочид буудлын тоо:** 800+ (Улаанбаатарт 200+, аймгуудад 600+)
- **Дунд хэмжээ:** 10-30 өрөөтэй жижиг буудал голд
- **Онлайн захиалга:** 1% хүрэхгүй — бараг бүгд утсаар
- **Хэл:** Монгол (Cyrillic) — primary, English — secondary

### 10 асуудал → 10 шийдэл

| Асуудал | Шийдэл | Pattern |
|---|---|---|
| 99% утсаар захиалдаг | Pre-call AI alert | unegui.mn + ubcab |
| Excel захиалга | PMS card grid | Trello + Linear |
| Cash preference | Cash default + сонголт | unegui.mn + Grab |
| Trust gap | Reputation score хоёр талд | ubcab + Airbnb |
| Захиалгын эргэлзээ | In-app host chat | Airbnb + WhatsApp |
| Үнэ өөрчлөгдөх | Price lock + 10% хил | Grab + Uber |
| GPS олдохгүй | Offline map | Maps.me |
| Зочин буцахгүй | Guest memory + loyalty tier | Ritz-Carlton + Starbucks |
| Marketing чадваргүй | AI autopilot | Meta + Canva |
| Жижиг invisible | Fair matching algorithm | ubcab |

---

## 👥 Хэрэглэгч

### Зочин (Guest)
- Бат-Эрдэнэ, 34, УБ, эхнэр + 2 хүүхэд
- Аймаг 3-4 удаа/жил (Хархорин, Хөвсгөл, Говь)
- iPhone 13 / дунд Android, 4G (орон нутагт 2G)
- Facebook, Messenger, Unegui.mn, ubcab

### Буудлын эзэн (Hotel)
- Дэлгэрмаа, 45, 14 өрөөтэй Хангай Resort (Хархорин)
- Дунд Android, 4G, Facebook Page + Excel

---

## 💼 Бизнес модель

| Tier | Үнэ/сар | Багтсан |
|---|---|---|
| Free | ₮0 | Сарын 10 lead, base PMS |
| Pro | ₮99K | Хязгааргүй lead, AI concierge |
| Premium | ₮199K | + Marketing autopilot, AI content |
| Enterprise | ₮499K+ | + Multi-property |

Commission: 5% (subscription-тай 3%), зөвхөн iHotel verified lead-д

**2026:** $30K MRR Q2, $83K MRR Q4, 500 hotels
**2027:** $5M ARR, 2000+ hotels, Korea + Kazakhstan

---

## 🏗 3 Mode

1. **Guest mode** (default, free) — хайх, чатлах, залгах, захиалах, loyalty
2. **Hotel mode** (verified, paid) — lead inbox, PMS, CRM, marketing, analytics
3. **XRoom mode** (anonymous, hourly) — dark theme, 4-digit code

---

## 📱 24+ Screen

Guest (14): Welcome, Search, Hotel Detail, Chat, Call, Payment, Booking, AI Concierge, Trips, Review, Saved, Profile, Verify, Settings

Hotel (10): Lead Inbox, Lead Detail, PMS Lite, Guests CRM, Marketing, Content AI, Host Inbox, Analytics, AI Assistant, Settings

XRoom: Dark search, 4-digit code

---

## 🎨 Design System

### Colors
```
Primary: #0F6E56 (teal CTA)
Teal-50: #E1F5EE, Teal-900: #04342C
Background: #F8F7F3, Card: #FFFFFF
Text: #1A1A1A (primary), #5F5E5A (secondary), #888780 (muted)
Border: #EDEDED, Amber: #F59E0B, Red: #E24B4A, Blue: #4A90D9
XRoom: #0A0A0A bg, #D4537E accent
```

### Typography
- System font (SF Pro / Roboto), weights: 400, 500 ONLY
- Display: 28-32px, H1: 22px, H2: 20px, H3: 16-17px, Body: 14-15px, Caption: 12-13px

### Spacing
- xs:4, sm:8, md:12, lg:16, xl:24, 2xl:32, 3xl:48

### Radius
- sm:8, md:12, lg:14, xl:16, 2xl:22, full:999

### Patterns
- Cards: white + 0.5px hairline + shadow + lg radius
- Buttons: teal + pressed 0.97 + haptic
- Icons: Lucide outline (NEVER emoji)
- Loading: skeleton (NEVER spinner for pages)

---

## 🧰 Tech Stack

- Monorepo: pnpm + Turborepo
- Mobile: Expo SDK 54 + TypeScript + Expo Router
- Web: Next.js 16 + Tailwind
- AI: Anthropic Claude API
- DB: Supabase (PostgreSQL + Auth + Realtime)
- Payments: QPay + Golomt iCube + Stripe + Apple/Google Pay

### Safe Libraries
- expo-linear-gradient, expo-image, expo-haptics, lucide-react-native
- RN Animated API (NOT reanimated)

### Dangerous (crash)
- react-native-reanimated, sonner-native, @shopify/flash-list, expo-blur

---

## 📂 Structure

```
newihotel/
├── apps/mobile/app/          # Expo Router screens
│   ├── (guest)/              # Guest tabs (search, ai, trips, saved, profile)
│   ├── hotel/[id].tsx        # Hotel detail
│   ├── chat/[id].tsx         # Host chat
│   ├── call/[id].tsx         # Call screen
│   ├── booking/[id].tsx      # Confirmation
│   ├── payment/[id].tsx      # Payment select
│   └── review/[id].tsx       # Review submit
├── apps/web/                 # Next.js
├── packages/ui/              # Shared components
├── packages/api/             # Mock API
├── packages/types/           # TypeScript interfaces
├── packages/config/          # Design tokens
└── PROJECT_CONTEXT.md        # ЭНЭ ФАЙЛ
```

---

## 🚦 Current State (2026-04-13)

### Done
- ✅ Monorepo + Expo SDK 54
- ✅ 14 guest screens (production UI: expo-image, lucide, haptics, gradients)
- ✅ Mock data layer
- ✅ GitHub: https://github.com/ihotelmn/newihotel
- ✅ TypeScript clean, bundle verified, dev server working

### Next
- ❌ Hotel side screens (10)
- ❌ XRoom mode
- ❌ Backend (Supabase schema, auth, RLS)
- ❌ NativeWind integration
- ❌ Real device polishing

---

## 🛠 Development Rules

1. **Session эхэнд:** `cat PROJECT_CONTEXT.md` уншина
2. **Код бичмэгц:** tsc + export + dev server шалгана
3. **Алдаа гарвал:** хэрэглэгчээс асуухгүй, ӨӨРӨӨ засна
4. **Commit:** `feat(mobile):`, `fix(mobile):`, `polish(mobile):`
5. **Push:** `git push origin main`

### Reload issues
```bash
cd apps/mobile && rm -rf node_modules .expo
cd ../.. && pnpm install
cd apps/mobile && npx expo start --clear
```
