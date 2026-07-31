import pandas as pd
import random

# Load leads dataset
leads = pd.read_csv("../generated/leads.csv")

# Keep only converted leads
converted_leads = leads[leads["lead_status"] == "Converted"].copy()

# If fewer than 50,000 converted leads exist, sample additional leads
if len(converted_leads) < 50000:
    remaining = 50000 - len(converted_leads)
    extra = leads[leads["lead_status"] != "Converted"].sample(
        n=remaining,
        random_state=42
    )
    converted_leads = pd.concat([converted_leads, extra])

# Ensure exactly 50,000 conversion rows
converted_leads = converted_leads.sample(
    n=50000,
    random_state=42
).reset_index(drop=True)

conversions = []

for _, row in converted_leads.iterrows():

    lead_date = pd.to_datetime(row["created_date"])

    conversion_date = lead_date + pd.Timedelta(
        days=random.randint(1, 30)
    )

    conversions.append({
        "conversion_id": len(conversions) + 1,
        "lead_id": int(row["lead_id"]),
        "campaign_id": int(row["campaign_id"]),
        "revenue": round(random.uniform(500, 100000), 2),
        "conversion_date": conversion_date.strftime("%Y-%m-%d")
    })

df = pd.DataFrame(conversions)

df.to_csv(
    "../generated/conversions.csv",
    index=False,
    encoding="utf-8"
)

print("=" * 50)
print("Conversions Dataset Generated Successfully")
print(f"Total Converted Leads: {len(df)}")
print("=" * 50)