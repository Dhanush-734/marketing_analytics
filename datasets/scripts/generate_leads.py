import pandas as pd
import random
from faker import Faker

# Set random seed for reproducibility
random.seed(42)
Faker.seed(42)

fake = Faker()

NUM_LEADS = 100000
MAX_CUSTOMERS = 50000
MAX_CAMPAIGNS = 10000

lead_sources = [
    "Google Ads",
    "Meta Ads",
    "LinkedIn Ads",
    "Email Marketing",
    "Organic Search"
]

lead_statuses = [
    "New",
    "Contacted",
    "Qualified",
    "Converted",
    "Lost"
]

status_weights = [30, 25, 20, 15, 10]

leads = []

for lead_id in range(1, NUM_LEADS + 1):
    leads.append({
        "lead_id": lead_id,
        "customer_id": random.randint(1, MAX_CUSTOMERS),
        "campaign_id": random.randint(1, MAX_CAMPAIGNS),
        "lead_source": random.choice(lead_sources),
        "lead_status": random.choices(
            lead_statuses,
            weights=status_weights,
            k=1
        )[0],
        "created_date": fake.date_between(
            start_date="-2y",
            end_date="today"
        ).isoformat()  # YYYY-MM-DD
    })

df = pd.DataFrame(leads)

df.sort_values("created_date", inplace=True)

df.to_csv(
    "../generated/leads.csv",
    index=False,
    encoding="utf-8"
)

print("=" * 50)
print("Leads Dataset Generated Successfully")
print("=" * 50)
print(df["lead_status"].value_counts())
print("=" * 50)
print("Total Leads:", len(df))