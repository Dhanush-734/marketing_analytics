import pandas as pd
import random
import numpy as np
from datetime import timedelta

# Set random seed for 100% reproducibility
random.seed(42)
np.random.seed(42)

# Load campaigns dataset
campaigns = pd.read_csv("../generated/campaigns.csv")

# Assign campaign-level performance efficiency profile to create realistic campaign variation
# High performers (15%), Normal performers (70%), Underperformers (15%)
campaign_efficiency = {}
for camp_id in campaigns["campaign_id"].unique():
    rand_val = random.random()
    if rand_val < 0.15:
        # High performing campaign (strong ROI)
        campaign_efficiency[camp_id] = random.uniform(1.4, 2.2)
    elif rand_val < 0.85:
        # Normal performing campaign
        campaign_efficiency[camp_id] = random.uniform(0.8, 1.3)
    else:
        # Underperforming campaign (low / negative ROI)
        campaign_efficiency[camp_id] = random.uniform(0.3, 0.7)

# Channel specific tendencies & parameters
channel_profiles = {
    1: {"name": "Google Ads", "cpc_range": (8.0, 25.0), "ctr_range": (0.02, 0.055), "conv_range": (0.035, 0.080), "aov_range": (400, 1200)},
    2: {"name": "Meta Ads", "cpc_range": (4.0, 15.0), "ctr_range": (0.015, 0.040), "conv_range": (0.025, 0.060), "aov_range": (350, 950)},
    3: {"name": "LinkedIn Ads", "cpc_range": (20.0, 60.0), "ctr_range": (0.008, 0.025), "conv_range": (0.015, 0.050), "aov_range": (800, 2500)},
    4: {"name": "YouTube Ads", "cpc_range": (5.0, 18.0), "ctr_range": (0.010, 0.030), "conv_range": (0.020, 0.050), "aov_range": (350, 1000)},
    5: {"name": "Email Marketing", "cpc_range": (0.5, 3.0), "ctr_range": (0.035, 0.100), "conv_range": (0.050, 0.120), "aov_range": (300, 850)}
}

performance = []
performance_id = 1

for _, campaign in campaigns.iterrows():
    camp_id = int(campaign["campaign_id"])
    ch_id = int(campaign["channel_id"]) if "channel_id" in campaign and campaign["channel_id"] in channel_profiles else 1
    ch_profile = channel_profiles.get(ch_id, channel_profiles[1])
    eff = campaign_efficiency.get(camp_id, 1.0)

    start_date = pd.to_datetime(campaign["start_date"])
    end_date = pd.to_datetime(campaign["end_date"])

    current_date = start_date

    while current_date <= end_date:
        # Scale impressions based on campaign budget & efficiency
        budget = campaign.get("budget", 25000)
        base_imp = random.randint(1500, 25000)
        impressions = int(base_imp * (budget / 25000) ** 0.5)
        impressions = max(500, impressions)

        # Clicks derived from CTR
        ctr = random.uniform(*ch_profile["ctr_range"])
        clicks = int(impressions * ctr)
        clicks = min(impressions, max(10, clicks))

        # CPC & Spend calculation
        cpc = random.uniform(*ch_profile["cpc_range"])
        spend = round(float(clicks * cpc), 2)

        # Conversions derived from conversion rate & efficiency
        base_conv_rate = random.uniform(*ch_profile["conv_range"])
        conv_rate = base_conv_rate * eff
        conversions = int(clicks * conv_rate)
        conversions = min(clicks, max(1, conversions))

        # Revenue derived from conversions & average order value
        base_aov = random.randint(*ch_profile["aov_range"])
        aov = base_aov * (0.85 + eff * 0.15)
        revenue = round(float(conversions * aov), 2)

        performance.append({
            "performance_id": performance_id,
            "campaign_id": camp_id,
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

tot_spend = df["spend"].sum()
tot_rev = df["revenue"].sum()
overall_roi = ((tot_rev - tot_spend) / tot_spend) * 100

print("=" * 60)
print("Daily Performance Dataset Generated Successfully")
print(f"Total Rows:     {len(df):,}")
print(f"Total Spend:    INR {tot_spend:,.2f}")
print(f"Total Revenue:  INR {tot_rev:,.2f}")
print(f"Overall ROI:    {overall_roi:.2f}%")
print("=" * 60)