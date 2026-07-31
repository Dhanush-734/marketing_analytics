import pandas as pd
import numpy as np

# Load dataset
df = pd.read_csv("marketing_campaign_dataset.csv")

# New columns
np.random.seed(42)

df["Campaign_Budget"] = np.random.randint(5000, 50000, len(df))
df["Revenue"] = (df["Campaign_Budget"] * (1 + df["ROI"]/100)).round(2)
df["ROAS"] = (df["Revenue"] / df["Campaign_Budget"]).round(2)
df["CTR"] = ((df["Clicks"] / df["Impressions"]) * 100).round(2)
df["CPC"] = (df["Acquisition_Cost"] / df["Clicks"]).replace([np.inf], 0).round(2)
df["CPM"] = ((df["Acquisition_Cost"] / df["Impressions"]) * 1000).round(2)

df["Device_Type"] = np.random.choice(
    ["Mobile", "Desktop", "Tablet"], len(df)
)

df["Campaign_Status"] = np.random.choice(
    ["Active", "Completed", "Paused"], len(df)
)

df["Marketing_Manager"] = np.random.choice(
    ["John", "Emma", "David", "Sophia", "Michael"], len(df)
)

# Save
df.to_csv("marketing_campaign_modified.csv", index=False)

print("Dataset modified successfully!")