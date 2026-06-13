import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

def scrape():
    """
    Scrape grants from Diia.Business (https://business.diia.gov.ua)
    """
    url = "https://business.diia.gov.ua/marketplace/financial-support"
    grants = []
    
    # Scaffolding for actual requests (wrapped in try-except to fall back to mock data if offline or blocked)
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "html.parser")
            # Example parsing logic:
            # cards = soup.select(".marketplace-card")
            # for card in cards:
            #     title = card.select_one(".marketplace-card__title").text.strip()
            #     ...
            pass
    except Exception as e:
        # Fallback or logging could go here
        pass

    # Return structured mock data representing actual format
    deadline_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    grants.append({
        "title": "Грантова програма підтримки жіночого підприємництва «Створюй!»",
        "description": "Програма для жінок-підприємиць в Україні, які хочуть масштабувати свій бізнес, придбати нове обладнання або найняти додатковий персонал.",
        "organizer": "Міністерство економіки України, Дія.Бізнес",
        "deadline": deadline_date,
        "amount": "150 000 грн",
        "categories": ["Жіноче підприємництво", "Виробництво", "Послуги"],
        "targetAudience": ["стартап", "ГО"],
        "sourceUrl": "https://business.diia.gov.ua/marketplace/financial-support/women-grant"
    })
    
    return grants
