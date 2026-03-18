from fastapi import APIRouter
import requests
import os
from dotenv import load_dotenv
from sklearn.linear_model import LinearRegression
import numpy as np

load_dotenv()

router = APIRouter()

API_KEY = os.getenv("AGMARKNET_API_KEY")
BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

def fetch_mandi_data(crop: str, limit: int = 100):
    params = {
        "api-key": API_KEY,
        "format": "json",
        "limit": limit,
        "filters[commodity]": crop.title(),
    }
    # Try 3 times with increasing timeout
    for attempt in range(3):
        try:
            timeout = 15 + (attempt * 10)  # 15s, 25s, 35s
            print(f"Attempt {attempt + 1} — timeout: {timeout}s")
            response = requests.get(BASE_URL, params=params, timeout=timeout)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                records = data.get("records", [])
                print(f"Records found: {len(records)}")
                if records:
                    return records
        except requests.exceptions.Timeout:
            print(f"Attempt {attempt + 1} timed out, retrying...")
        except Exception as e:
            print(f"Error: {e}")
            break
    return []

@router.get("/best-mandi")
def get_best_mandi(crop: str, quantity: float, farmer_district: str = ""):
    records = fetch_mandi_data(crop)

    if not records:
        return {"error": f"Government API is slow right now. Please try again in a moment."}

    sorted_records = sorted(
        records,
        key=lambda x: float(x.get("modal_price", 0) or 0),
        reverse=True
    )

    seen = set()
    top_mandis = []
    for r in sorted_records:
        mandi = r.get("market", "") or r.get("Market", "")
        if mandi and mandi not in seen:
            seen.add(mandi)
            price = float(r.get("modal_price", 0) or r.get("Modal_Price", 0))
            revenue = price * (quantity / 100)
            top_mandis.append({
                "mandi": mandi,
                "price": price,
                "state": r.get("state", "") or r.get("State", ""),
                "district": r.get("district", "") or r.get("District", ""),
                "estimated_revenue": round(revenue, 2),
                "date": r.get("arrival_date", "") or r.get("Arrival_Date", ""),
            })
        if len(top_mandis) == 3:
            break

    if not top_mandis:
        return {"error": "Could not process mandi data. Please try again."}

    return {
        "recommendations": top_mandis,
        "crop": crop,
        "quantity": quantity,
        "source": "data.gov.in - Ministry of Agriculture"
    }

@router.get("/price-prediction")
def predict_price(crop: str):
    records = fetch_mandi_data(crop, limit=50)

    if len(records) < 3:
        return {"error": "Not enough data for prediction. Please try again."}

    prices = []
    for r in records:
        try:
            price = float(r.get("modal_price", 0) or r.get("Modal_Price", 0))
            if price > 0:
                prices.append(price)
        except:
            continue

    if len(prices) < 3:
        return {"error": "Not enough valid price data"}

    X = np.arange(len(prices)).reshape(-1, 1)
    y = np.array(prices)
    model = LinearRegression().fit(X, y)
    next_price = model.predict([[len(prices)]])[0]
    trend = "increasing 📈" if model.coef_[0] > 0 else "decreasing 📉"
    avg_price = round(sum(prices) / len(prices), 2)

    return {
        "crop": crop,
        "predicted_price": round(next_price, 2),
        "trend": trend,
        "average_price": avg_price,
        "data_points": len(prices),
        "source": "data.gov.in - Ministry of Agriculture"
    }

@router.get("/test")
def mandi_test():
    return {"message": "Mandi route working ✅"}