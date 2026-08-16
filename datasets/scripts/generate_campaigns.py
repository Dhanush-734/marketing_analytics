import pandas as pd
import random
import numpy as np
from faker import Faker

# Set random seeds for 100% reproducibility
random.seed(42)
np.random.seed(42)
Faker.seed(42)

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

    # Realistic budget distribution (small, medium, large campaigns)
    # Log-normal distribution scaled between 5,000 and 150,000 INR
    budget_raw = float(np.random.lognormal(mean=9.5, sigma=0.8))
    budget = int(np.clip(budget_raw, 5000, 150000))

    campaigns.append({
        "campaign_id": i,
        "campaign_name": fake.catch_phrase(),
        "channel_id": random.randint(1, 5),
        "campaign_type": random.choice(campaign_types),
        "budget": budget,
        "start_date": start,
        "end_date": end,
        "status": random.choice(statuses)
    })

df = pd.DataFrame(campaigns)

df.to_csv("../generated/campaigns.csv", index=False)

print("Campaign dataset generated successfully!")
print(f"Total Campaigns: {len(df):,}")
print(f"Budget Range: INR {df['budget'].min():,} - INR {df['budget'].max():,}")
