# GrantHub UA — Фронтенд (Next.js)

Ця папка містить користувацький інтерфейс для платформи **GrantHub UA**, розроблений на Next.js (App Router) з використанням Vanilla CSS.

## 🎨 Дизайн та стилістика (Positivus)

Інтерфейс стилізований на основі популярного шаблону **Positivus** з наступними правилами:
- **Шрифт:** `Space Grotesk` (підключено в `globals.css` через Google Fonts).
- **Кольори:**
  - Акцентний зелений: `#B9FF66`
  - Основний темний: `#191A23`
  - Фоновий сірий: `#F3F3F3`
  - Білий: `#FFFFFF`
- **Neo-Brutalist елементи:** Всі картки та інтерактивні елементи мають чітку темну рамку `1px solid #191A23` та жорсткі зміщені тіні (`0px 5px 0px #191A23`).

---

## 🗺️ Доступні сторінки (Routes)

У рамках MVP створено лише три ключові сторінки (згідно з планом розробки):
1. **Головна сторінка (`/`)**: [frontend/src/app/page.tsx](file:///d:/Projects/Grants/frontend/src/app/page.tsx) — Лендинг з описом платформи та переходами до авторизації.
2. **Вхід (`/login`)**: [frontend/src/app/login/page.tsx](file:///d:/Projects/Grants/frontend/src/app/login/page.tsx) — Форма авторизації користувача.
3. **Реєстрація (`/register`)**: [frontend/src/app/register/page.tsx](file:///d:/Projects/Grants/frontend/src/app/register/page.tsx) — Форма створення акаунту із вибором ролі (студент, стартап, ГО).

---

## 🛠️ Запуск у режимі розробки

Встановіть залежності та запустіть сервер:
```bash
npm install
npm run dev
```

Сервер за замовчуванням стартує на порту [http://localhost:3000](http://localhost:3000). Якщо цей порт вже використовується (наприклад, бекендом), Next.js автоматично переключиться на порт `3001`.
