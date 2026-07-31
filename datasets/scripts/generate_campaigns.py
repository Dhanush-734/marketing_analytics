import pandas as pd
import random
from faker import Faker

fake = Faker()

campaign_types = [
    "Brand Awareness",
    "Lead Generation",
    "Sales",
    "Remarketing",
    "Product Launch"
]

statuses = [
    "Active",
    "Completed",
    "Paused"
]

campaigns = []

for i in range(1, 10001):

    start = fake.date_between("-2y", "today")
    end = fake.date_between(start, "+90d")

    campaigns.append({
        "campaign_id": i,
        "campaign_name": fake.catch_phrase(),
        "channel_id": random.randint(1,5),
        "campaign_type": random.choice(campaign_types),
        "budget": random.randint(10000,500000),
        "start_date": start,
        "end_date": end,
        "status": random.choice(statuses)
    })

df = pd.DataFrame(campaigns)

df.to_csv("../generated/campaigns.csv", index=False)

print("Campaign dataset generated successfully!")
