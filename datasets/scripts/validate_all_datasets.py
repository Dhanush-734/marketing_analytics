import pandas as pd
import numpy as np

def validate_datasets():
    print("=" * 70)
    print("STARTING DATASET VALIDATION PIPELINE")
    print("=" * 70)

    # Load datasets
    campaigns = pd.read_csv("../generated/campaigns.csv")
    customers = pd.read_csv("../generated/customers.csv")
    leads = pd.read_csv("../generated/leads.csv")
    conversions = pd.read_csv("../generated/conversions.csv")
    daily_perf = pd.read_csv("../generated/daily_performance.csv")
    email_camp = pd.read_csv("../generated/email_campaigns.csv")

    # 1. Non-negativity & Hierarchy checks
    assert (daily_perf["spend"] >= 0).all(), "Error: Negative spend found"
    assert (daily_perf["revenue"] >= 0).all(), "Error: Negative revenue found"
    assert (daily_perf["impressions"] >= 0).all(), "Error: Negative impressions found"
    assert (daily_perf["clicks"] <= daily_perf["impressions"]).all(), "Error: Clicks > Impressions found"
    assert (daily_perf["conversions"] <= daily_perf["clicks"]).all(), "Error: Conversions > Clicks found"

    # 2. Email hierarchy checks
    assert (email_camp["emails_opened"] <= email_camp["emails_sent"]).all(), "Error: Emails opened > sent"
    assert (email_camp["emails_clicked"] <= email_camp["emails_opened"]).all(), "Error: Emails clicked > opened"

    # 3. ID Uniqueness & FK Integrity
    assert campaigns["campaign_id"].is_unique, "Error: Duplicate campaign_id"
    assert customers["customer_id"].is_unique, "Error: Duplicate customer_id"
    assert leads["lead_id"].is_unique, "Error: Duplicate lead_id"
    assert conversions["conversion_id"].is_unique, "Error: Duplicate conversion_id"
    assert daily_perf["performance_id"].is_unique, "Error: Duplicate performance_id"

    # FK Integrity
    assert set(leads["campaign_id"]).issubset(set(campaigns["campaign_id"])), "Error: Invalid campaign_id in leads"
    assert set(leads["customer_id"]).issubset(set(customers["customer_id"])), "Error: Invalid customer_id in leads"
    assert set(conversions["lead_id"]).issubset(set(leads["lead_id"])), "Error: Invalid lead_id in conversions"
    assert set(daily_perf["campaign_id"]).issubset(set(campaigns["campaign_id"])), "Error: Invalid campaign_id in daily_performance"

    # 4. Aggregates
    tot_spend = daily_perf["spend"].sum()
    tot_rev = daily_perf["revenue"].sum()
    overall_roi = ((tot_rev - tot_spend) / tot_spend * 100) if tot_spend > 0 else 0
    overall_roas = (tot_rev / tot_spend) if tot_spend > 0 else 0
    tot_leads = len(leads)
    tot_qual_leads = len(leads[leads["lead_status"] == "Qualified"])
    tot_convs = len(conversions)
    tot_custs = len(customers)

    print("\n" + "=" * 70)
    print("DATA QUALITY VALIDATION PASSED SUCCESSFULLY")
    print("=" * 70)
    print(f"  Total Campaigns:        {len(campaigns):,}")
    print(f"  Total Customers:        {tot_custs:,}")
    print(f"  Total Leads:            {tot_leads:,}")
    print(f"  Qualified Leads:        {tot_qual_leads:,}")
    print(f"  Total Conversions:      {tot_convs:,}")
    print(f"  Daily Performance Rows: {len(daily_perf):,}")
    print(f"  Total Spend:            INR {tot_spend:,.2f}")
    print(f"  Total Revenue:          INR {tot_rev:,.2f}")
    print(f"  Overall ROI:            {overall_roi:.2f}%")
    print(f"  Overall ROAS:           {overall_roas:.2f}")
    print("=" * 70)
    print("DATA GENERATION COMPLETED SUCCESSFULLY")
    print("=" * 70)

if __name__ == "__main__":
    validate_datasets()
