# iHotel Project Rules

## ABSOLUTE RULE: No Runtime Errors
- Хэрэглэгч ХЭЗЭЭ Ч runtime error харахгүй байх ёстой
- Код бичсэний дараа ЗААВАЛ өөрөө шалгана: `npx tsc --noEmit` + `npx expo export --platform ios` + dev server bundle test
- Алдаа олдвол хэрэглэгчид хандахгүйгээр ӨӨРӨӨ засна
- Хэрэглэгчээр тест хийлгэхгүй, screenshot авуулахгүй — бүгдийг өөрөө баталгаажуулна

## Import Rules (Expo Mobile App)
- 3rd party library нэмэхээс ӨМНӨ: duplicate React үүсэх эсэхийг шалгах
- `packages/ui` дотор native library-г dependencies-д БИШ peerDependencies-д байрлуулах
- Шинэ package суулгасны дараа ЗААВАЛ `find node_modules -path "*/node_modules/react/index.js" | grep -v react-native | grep -v react-dom` ажиллуулж duplicate шалгах
- Одоогоор бүх screen зөвхөн react-native core + expo-router ашиглана. 3rd party UI нэмэхээс өмнө device test хийх

## pnpm Monorepo
- `.npmrc` дотор `node-linker=hoisted` — Metro symlink дэмждэггүй тул заавал хэрэгтэй
- `metro.config.js` дотор `nodeModulesPaths` нь monorepo root `node_modules` руу заана
- `watchFolders` зөвхөн `packages/*` директоруудыг агуулна (monorepo root биш — тэр Metro root confusion үүсгэнэ)

## Testing Checklist (код бичсэн бүрт)
1. `npx tsc --noEmit` — 0 error
2. `npx expo export --platform ios --output-dir /tmp/test` — bundle success
3. Dev server: `npx expo start --clear --lan` → `curl` bundle URL → HTTP 200
4. Bundle дотор React хуулбар шалгах: `grep -c 'exports.useId = function'` ≤ 2
5. Алдаатай бол хэрэглэгчид "шалгаарай" гэж ХЭЗЭЭ Ч хэлэхгүй — өөрөө засна

## Project Structure
- apps/mobile — Expo SDK 54, Expo Router, React Native 0.81
- apps/web — Next.js (тусдаа, mobile-д нөлөөлөхгүй)
- packages/config, types, api, hooks, ui — shared packages
- Mock data: USE_MOCK=true, inline mock data in screens

## Mongolian UI
- Бүх text Mongolian
- Cyrillic overflow тест хийх
- System font (SF Pro iOS, Roboto Android)
