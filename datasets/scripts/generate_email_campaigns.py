import pandas as pd
import random
from faker import Faker

# Set random seed for 100% reproducibility
random.seed(42)
Faker.seed(42)

# Initialize Faker
fake = Faker("en_IN")

# Load campaigns dataset
campaigns = pd.read_csv("../generated/campaigns.csv")

email_campaigns = []

email_id = 1

# Generate email campaign data
for _, campaign in campaigns.iterrows():
    emails_sent = random.randint(1000, 50000)

    open_rate = random.uniform(0.15, 0.45)
    emails_opened = int(emails_sent * open_rate)
    emails_opened = min(emails_sent, max(10, emails_opened))

    click_rate = random.uniform(0.05, 0.30)
    emails_clicked = int(emails_opened * click_rate)
    emails_clicked = min(emails_opened, max(1, emails_clicked))

    unsubscribe_rate = random.uniform(0.005, 0.03)
    unsubscribes = int(emails_sent * unsubscribe_rate)
    unsubscribes = min(emails_sent, unsubscribes)

    email_campaigns.append({
        "email_id": email_id,
        "campaign_id": int(campaign["campaign_id"]),
        "emails_sent": emails_sent,
        "emails_opened": emails_opened,
        "emails_clicked": emails_clicked,
        "unsubscribes": unsubscribes
    })

    email_id += 1

# Create DataFrame
df = pd.DataFrame(email_campaigns)

# Save CSV
df.to_csv("../generated/email_campaigns.csv", index=False)

print("=" * 60)
print("Email Campaign Dataset Generated Successfully")
print(f"Total Rows : {len(df):,}")
print("=" * 60)
