# GrantHub UA — Парсер грантів (Python)

Ця папка містить Python-скрипти для автоматичного збору (скрапінгу) інформації про активні гранти в Україні.

## 📁 Структура парсера

- `main.py` — головний вхідний скрипт для запуску парсингу.
- `requirements.txt` — список необхідних бібліотек (`beautifulsoup4`, `requests`, `lxml`).
- `scrapers/` — папка з окремими парсерами для кожного джерела:
  - `diia_business.py` — скрапер для порталу Дія.Бізнес.
  - `house_of_europe.py` — скрапер для House of Europe.
  - `gurt.py` — скрапер для порталу ГУРТ.

---

## 🛠️ Встановлення та запуск

1. Створіть та активуйте віртуальне середовище:
```bash
python -m venv venv
# Активація для Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Активація для macOS/Linux:
source venv/bin/activate
```

2. Встановіть необхідні бібліотеки:
```bash
pip install -r requirements.txt
```

3. Запуск парсингу:
```bash
# Скрапінг з усіх джерел (Дія.Бізнес, House of Europe, ГУРТ)
python main.py --source all

# Скрапінг з конкретного джерела (наприклад, gurt)
python main.py --source gurt
```

Парсер повертає структурований JSON-масив об'єктів у стандартний потік виведення (`stdout`), що дозволяє бекенду легко зчитувати та зберігати дані в базу даних.
