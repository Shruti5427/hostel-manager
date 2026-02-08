import requests
import json

# The URL of your running backend
API_URL = "http://127.0.0.1:8000/users/"

# The list of users to create
users = [
    # --- The Warden ---
    {
        "username": "warden_patil",
        "email": "warden@college.edu",
        "password": "wardenpassword123",
        "role": "warden",
    },
    # --- Students ---
    {
        "username": "rahul_student",
        "email": "rahul@college.edu",
        "password": "rahulpassword123",
        "role": "student",
    },
    {
        "username": "priya_sharma",
        "email": "priya@college.edu",
        "password": "priyapassword123",
        "role": "student",
    },
    {
        "username": "amit_kumar",
        "email": "amit@college.edu",
        "password": "amitpassword123",
        "role": "student",
    },
]


def seed_database():
    print("🌱 Starting Database Seeding...")

    for user in users:
        try:
            response = requests.post(API_URL, json=user)
            if response.status_code == 200:
                print(f"✅ Created: {user['username']} ({user['role']})")
            elif response.status_code == 400:
                print(f"⚠️  Skipped: {user['username']} (Already exists)")
            else:
                print(f"❌ Failed: {user['username']} - {response.text}")
        except Exception as e:
            print(f"❌ Error connecting to API: {e}")

    print("\n✨ Seeding Complete!")


if __name__ == "__main__":
    seed_database()
