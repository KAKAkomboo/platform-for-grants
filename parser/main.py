import json
import argparse
import sys
from scrapers import diia_business, house_of_europe, gurt

def main():
    parser = argparse.ArgumentParser(description="GrantHub UA Scraper CLI")
    parser.add_argument(
        "--source",
        choices=["diia", "house_of_europe", "gurt", "all"],
        default="all",
        help="Select a specific scraping source (default: all)"
    )
    args = parser.parse_args()

    results = []

    if args.source in ["diia", "all"]:
        try:
            results.extend(diia_business.scrape())
        except Exception as e:
            print(f"Error scraping Diia.Business: {e}", file=sys.stderr)

    if args.source in ["house_of_europe", "all"]:
        try:
            results.extend(house_of_europe.scrape())
        except Exception as e:
            print(f"Error scraping House of Europe: {e}", file=sys.stderr)

    if args.source in ["gurt", "all"]:
        try:
            results.extend(gurt.scrape())
        except Exception as e:
            print(f"Error scraping GURT: {e}", file=sys.stderr)

    # Print results to stdout as JSON string
    print(json.dumps(results, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
