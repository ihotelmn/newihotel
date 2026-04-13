# iHotel Project Rules & Context

## ABSOLUTE RULE: No Runtime Errors
- Хэрэглэгч ХЭЗЭЭ Ч runtime error харахгүй байх ёстой
- Код бичсэний дараа ЗААВАЛ өөрөө шалгана: `npx tsc --noEmit` + `npx expo export --platform ios` + dev server bundle test
- Алдаа олдвол хэрэглэгчид хандахгүйгээр ӨӨРӨӨ засна
- Хэрэглэгчээр тест хийлгэхгүй, screenshot авуулахгүй — бүгдийг өөрөө баталгаажуулна

## Project Overview
- iHotel = Монголын 800+ зочид буудалд утсаар захиалга хүлээж авах AI-first mobile app
- Зочин "залгах" дарахад буудалд AI context автоматаар явдаг, pre-call alert-аар мэдэгддэг
- 3 mode: Guest (default), Hotel (paid), XRoom (anonymous hourly)
- Mock-first: USE_MOCK=true, backend Supabase (хожим)
- GitHub: https://github.com/ihotelmn/newihotel

## Safe Libraries (алдаагүй ажилладаг)
- expo-linear-gradient — gradient background
- expo-image (Image as ExpoImage) — blurhash, transition
- expo-haptics (* as Haptics) — tactile feedback
- lucide-react-native — icons (NEVER emoji in UI)
- RN Animated API — animations (spring, timing, stagger)

## DANGEROUS Libraries (runtime crash үүсгэдэг)
- react-native-reanimated — duplicate React + babel plugin conflict
- sonner-native — useId hook crash
- @shopify/flash-list — type conflict
- expo-blur — RN version conflict
- react-native-gesture-handler — wrapper issues
- react-native-safe-area-context — Provider missing crash

## Import Rules
- 3rd party нэмэхээс ӨМНӨ duplicate React шалгах
- packages/ui дотор native library → peerDependencies (NEVER dependencies)
- Шинэ package суулгасны дараа: `find node_modules -path "*/node_modules/react/index.js"` шалгах
- Metro resolveRequest нь react-г нэг copy болгож байгаа (metro.config.js)

## pnpm Monorepo
- `.npmrc`: `node-linker=hoisted` (Metro symlink дэмждэггүй)
- `metro.config.js`: nodeModulesPaths → monorepo root, watchFolders → packages/* only
- resolveRequest → react singleton enforcement

## Testing Checklist (ЗААВАЛ код бичсэн бүрт)
1. `npx tsc --noEmit` — 0 error
2. `npx expo export --platform ios --output-dir /tmp/test` — bundle success
3. Dev server bundle: HTTP 200
4. React copies: `grep -c 'exports.useId = function'` ≤ 2
5. Алдаатай бол "шалгаарай" гэж ХЭЗЭЭ Ч хэлэхгүй — өөрөө засна

## Design System
- Primary: #0F6E56 (teal), Background: #F8F7F3, Card: #FFFFFF
- Text: #1A1A1A (primary), #5F5E5A/#888 (secondary)
- Amber: #F59E0B (rating), Red: #E24B4A (destructive), Blue: #4A90D9/#E3F0FF (host chat)
- Dark teal: #04342C, Border: #EDEDED
- Font weight: ЗӨВХӨН 400, 500 (ХЭЗЭЭ Ч 600, 700 биш)
- Letter-spacing: -0.02em headings, -0.01em titles
- Icons: Lucide outline 16-24px (NEVER emoji)
- Cards: white bg + 0.5px hairline + shadow + 14-16px radius
- Buttons: teal bg + white text + pressed scale 0.97 + haptic
- Loading: skeleton placeholder (NEVER spinner for page load)
- Toasts: Alert.alert (sonner crash хийдэг)
- Modal: bottom sheet (NEVER alert for choices)

## Typography Scale
- Display: 28-32px, H1: 22px, H2: 20px, H3: 16-17px
- Body: 14-15px, Caption: 12-13px, Micro: 10-11px

## Spacing
- xs: 4, sm: 8, md: 12, lg: 16, xl: 24, 2xl: 32, 3xl: 48

## Screens (14 guest + 10 hotel + XRoom)
Guest: Welcome, Search, Hotel Detail, Chat, Call, Booking, AI Concierge, Trips, Saved, Payment, Review, Profile, Verify, Settings
Hotel: Lead Inbox, Lead Detail, PMS Lite, Guests CRM, Marketing, Content AI, Host Inbox, Analytics, AI Assistant, Settings

## Current State
- 14 guest screen бэлэн (production UI: expo-image, lucide, haptics, linear-gradient)
- Hotel side screens дутуу
- Mock data inline бүх screen-д
- TypeScript clean, bundle 2807 modules, dev server HTTP 200

## Mongolian UI
- Бүх text Mongolian (Cyrillic)
- Cyrillic overflow тест хийх
- System font (SF Pro iOS, Roboto Android)
- 99% утсаар захиалга → "Залгах" button ил харагдах

## Reference Apps
- Airbnb (cards, messaging, search)
- Booking.com (filters, urgency)
- Linear (transitions, density)
- Revolut (payments, success states)
- unegui.mn (Монгол familiarity)
- ubcab (rating хоёр тал)

## Commit Convention
- feat(mobile): шинэ feature
- fix(mobile): засвар
- polish(mobile): UI/UX сайжруулалт
- chore: setup, config, tooling
