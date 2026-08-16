import pandas as pd
import random
from faker import Faker

# Set random seed for reproducibility
random.seed(42)
Faker.seed(42)

fake = Faker("en_IN")

cities = [
    ("Bengaluru", "Karnataka"),
    ("Mumbai", "Maharashtra"),
    ("Delhi", "Delhi"),
    ("Hyderabad", "Telangana"),
    ("Chennai", "Tamil Nadu"),
    ("Pune", "Maharashtra"),
    ("Kolkata", "West Bengal"),
    ("Ahmedabad", "Gujarat"),
    ("Jaipur", "Rajasthan"),
    ("Lucknow", "Uttar Pradesh")
]

segments = [
    "New",
    "Returning",
    "Premium"
]

customers = []

for i in range(1, 50001):
    city, state = random.choice(cities)

    customers.append({
        "customer_id": i,
        "customer_name": fake.name(),
        "gender": random.choice(["Male", "Female"]),
        "age": random.randint(18, 65),
        "city": city,
        "state": state,
        "country": "India",
        "customer_segment": random.choice(segments)
    })

df = pd.DataFrame(customers)

df.to_csv("../generated/customers.csv", index=False)

print("customers.csv generated successfully!")
print(f"Total Customers: {len(df):,}")
