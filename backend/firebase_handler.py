import firebase_admin
from firebase_admin import credentials, db

SERVICE_ACCOUNT = "firebase_service_account.json"
DB_URL = ""

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT)
    firebase_admin.initialize_app(cred, {
        'databaseURL': DB_URL
    })

def update_bin_count(material, count):
    ref = db.reference(f"bins/{material}")
    ref.set({
        "count": count,
        "capacity": 10,
        "status": "FULL" if count >= 10 else "AVAILABLE"
    })
