# GrantHub UA — Бекенд (NestJS)

Ця папка містить серверний код (API) для платформи **GrantHub UA**, розроблений на NestJS з використанням бази даних MongoDB (через Mongoose).

## 🏗️ Архітектура модулів

Бекенд побудовано за модульним принципом NestJS:
- **`AuthModule`**: Реєстрація користувачів (bcrypt хешування), авторизація (JWT-токени), стратегія перевірки сесії.
- **`UsersModule`**: Керування профілями користувачів (тип профілю, обрані категорії) та збереження грантів в обране.
- **`GrantsModule`**: Каркас для пошуку, фільтрації та ручного додавання грантів.
- **`ParserModule`**: Каркас для інтеграції та запуску Python-скрипта парсингу.
- **`AnalyticsModule`**: Каркас для отримання адміністративної аналітики (кількість користувачів, грантів, популярні категорії).

---

## 💾 Схеми MongoDB (Mongoose)

1. **`User`** (`schemas/user.schema.ts`):
   - `email`: унікальний логін
   - `passwordHash`: хешований пароль
   - `role`: роль користувача (`user` | `admin`)
   - `profileType`: тип (`student` | `startup` | `ngo`)
   - `categories`: масив обраних категорій інтересів
   - `favorites`: масив зв'язків з об'єктами `Grant`

2. **`Grant`** (`schemas/grant.schema.ts`):
   - `title`, `description`, `organizer`, `amount`, `sourceUrl`
   - `deadline`: дата закінчення подачі
   - `categories`: категорії гранту
   - `targetAudience`: аудиторія (`student` | `startup` | `ngo`)
   - `status`: стан гранту (`active` | `archived`)
   - `viewsCount`, `favoritesCount`: лічильники для аналітики

---

## 🛠️ Запуск у режимі розробки

```bash
npm install
npm run start:dev
```

Бекенд автоматично використовує налаштування з файлу `.env` (якщо він є), інакше підключається до локального хоста за замовчуванням:
`mongodb://admin:password@localhost:27017/granthub_db?authSource=admin`

API доступне за префіксом `/api`: [http://localhost:3000/api](http://localhost:3000/api)
