"""
Analytics helper module for Marketing Campaign & Multi-Channel ROI Analytics Platform.
"""

def calculate_roi(spend: float, revenue: float) -> float:
    """
    Calculates overall ROI percentage: ((Revenue - Spend) / Spend) * 100
    """
    if not spend or spend == 0:
        return 0.0
    return round(((revenue - spend) / spend) * 100, 2)


def summarize_campaigns(campaigns):
    """
    Summarizes list of Campaign objects calculating overall ROI.
    """
    total_spend = sum(getattr(c, 'spend', 0) for c in campaigns)
    total_revenue = sum(getattr(c, 'revenue', 0) for c in campaigns)
    overall_roi = calculate_roi(total_spend, total_revenue)
    return {
        "total_campaigns": len(campaigns),
        "total_spend": total_spend,
        "total_revenue": total_revenue,
        "overall_roi": overall_roi,
    }
