import pandas as pd
import random
from datetime import timedelta

# Load campaigns dataset
campaigns = pd.read_csv("../generated/campaigns.csv")

performance = []
performance_id = 1

for _, campaign in campaigns.iterrows():

    start_date = pd.to_datetime(campaign["start_date"])
    end_date = pd.to_datetime(campaign["end_date"])

    current_date = start_date

    while current_date <= end_date:

        impressions = random.randint(1000, 50000)

        ctr = random.uniform(0.02, 0.12)
        clicks = int(impressions * ctr)

        cpc = random.uniform(5, 50)
        spend = round(clicks * cpc, 2)

        conversion_rate = random.uniform(0.02, 0.15)
        conversions = max(1, int(clicks * conversion_rate))

        avg_order_value = random.randint(500, 5000)
        revenue = conversions * avg_order_value

        performance.append({
            "performance_id": performance_id,
            "campaign_id": int(campaign["campaign_id"]),
            "performance_date": current_date.strftime("%Y-%m-%d"),
            "impressions": impressions,
            "clicks": clicks,
            "spend": spend,
            "conversions": conversions,
            "revenue": revenue
        })

        performance_id += 1

        # Generate one record every 7 days
        current_date += timedelta(days=7)

df = pd.DataFrame(performance)

df.to_csv(
    "../generated/daily_performance.csv",
    index=False,
    encoding="utf-8"
)

print("=" * 60)
print("Daily Performance Dataset Generated Successfully")
print(f"Total Rows: {len(df):,}")
print("=" * 60)