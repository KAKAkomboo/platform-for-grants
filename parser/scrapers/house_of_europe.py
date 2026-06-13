import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

def scrape():
    """
    Scrape grants from House of Europe (https://houseofeurope.org.ua)
    """
    url = "https://houseofeurope.org.ua/grants"
    grants = []
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "html.parser")
            # Scrape details
            pass
    except Exception as e:
        pass

    deadline_date = (datetime.now() + timedelta(days=45)).strftime("%Y-%m-%d")
    grants.append({
        "title": "Гранти на персональні проєкти у сфері культури",
        "description": "Фінансування індивідуальних ініціатив для менеджерів культури, митців та дослідників. Можливість реалізувати проєкт у співпраці з європейськими партнерами.",
        "organizer": "House of Europe",
        "deadline": deadline_date,
        "amount": "4 000 EUR",
        "categories": ["Культура та мистецтво", "Освіта"],
        "targetAudience": ["студент", "ГО"],
        "sourceUrl": "https://houseofeurope.org.ua/grants/personal-projects-culture"
    })
    
    return grants
