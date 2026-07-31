import pandas as pd

leads = pd.read_csv("../generated/leads.csv")
conversions = pd.read_csv("../generated/conversions.csv")

print("Leads:", len(leads))
print("Conversions:", len(conversions))
import pandas as pd

df = pd.read_csv("../generated/leads.csv")
print(df["created_date"].head(10).tolist())