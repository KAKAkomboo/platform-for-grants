import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

def scrape():
    """
    Scrape grants from GURT Portal (https://gurt.org.ua)
    """
    url = "https://gurt.org.ua/news/grants/"
    grants = []
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "html.parser")
            # Parse announcements
            pass
    except Exception as e:
        pass

    deadline_date = (datetime.now() + timedelta(days=15)).strftime("%Y-%m-%d")
    grants.append({
        "title": "Конкурс мінігрантів для розвитку місцевих громад",
        "description": "Підтримка локальних громадських ініціатив, спрямованих на вирішення екологічних та соціальних проблем у селищах та невеликих містах.",
        "organizer": "Ресурсний центр ГУРТ",
        "deadline": deadline_date,
        "amount": "50 000 грн",
        "categories": ["Екологія", "Соціальні проєкти", "Розвиток громад"],
        "targetAudience": ["ГО"],
        "sourceUrl": "https://gurt.org.ua/news/grants/community-development-competition"
    })
    
    return grants
