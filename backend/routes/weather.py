from fastapi import APIRouter
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

@router.get("/current")
def get_weather(city: str = "Delhi"):
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": f"{city},IN",
            "appid": WEATHER_API_KEY,
            "units": "metric"
        }
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        print(f"Status: {response.status_code}")
        print(f"Response: {data}")

        if response.status_code != 200:
            return {"error": f"API Error: {data.get('message', 'City not found')}"}

        temp = data["main"]["temp"]
        humidity = data["main"]["humidity"]
        condition = data["weather"][0]["main"]

        seasonal = get_seasonal_crops(temp, humidity, condition)

        return {
            "city": data["name"],
            "state": data.get("sys", {}).get("country", "IN"),
            "temperature": round(temp),
            "feels_like": round(data["main"]["feels_like"]),
            "humidity": humidity,
            "description": data["weather"][0]["description"].title(),
            "icon": data["weather"][0]["icon"],
            "wind_speed": data["wind"]["speed"],
            "visibility": data.get("visibility", 0) // 1000,
            "farming_advice": get_farming_advice(condition, temp, humidity),
            "season": seasonal["season"],
            "recommended_crops": seasonal["recommended_crops"],
            "seasonal_advice": seasonal["seasonal_advice"],
            "current_month": seasonal["month"]
        }
    except Exception as e:
        print(f"Exception: {e}")
        return {"error": str(e)}

def get_farming_advice(condition: str, temp: float, humidity: int) -> str:
    condition = condition.lower()
    if "rain" in condition:
        return "🌧️ Rain expected — avoid spraying pesticides. Good time for irrigation-free farming."
    elif "clear" in condition and temp > 35:
        return "☀️ Very hot day — water your crops early morning or evening. Avoid afternoon irrigation."
    elif "clear" in condition and temp < 15:
        return "❄️ Cold weather — protect sensitive crops from frost. Good time for Rabi crops."
    elif "cloud" in condition:
        return "⛅ Cloudy weather — good conditions for spraying fertilizers and pesticides."
    elif "thunderstorm" in condition:
        return "⛈️ Thunderstorm warning — secure your farm equipment and avoid outdoor work."
    elif humidity > 80:
        return "💧 High humidity — watch out for fungal diseases. Ensure proper crop ventilation."
    elif humidity < 30:
        return "🌵 Low humidity — increase irrigation frequency to prevent crop stress."
    else:
        return "🌾 Normal weather conditions — continue regular farming activities."

def get_seasonal_crops(temp: float, humidity: int, condition: str) -> dict:
    import datetime
    month = datetime.datetime.now().month

    # Kharif season (June - November)
    if 6 <= month <= 11:
        season = "Kharif (खरीफ)"
        if temp > 30 and humidity > 60:
            crops = ["Rice 🌾", "Maize 🌽", "Cotton 🌿", "Sugarcane 🎋", "Soyabean"]
            advice = "Perfect conditions for Kharif crops. Ensure proper drainage for rice fields."
        elif temp > 25:
            crops = ["Groundnut", "Sunflower 🌻", "Bajra", "Jowar", "Moong Dal"]
            advice = "Good temperature for Kharif pulses. Monitor soil moisture regularly."
        else:
            crops = ["Maize 🌽", "Bajra", "Jowar", "Groundnut"]
            advice = "Moderate conditions — focus on drought-resistant Kharif varieties."

    # Rabi season (November - April)
    elif month <= 4 or month == 11 or month == 12:
        season = "Rabi (रबी)"
        if temp < 20 and humidity < 60:
            crops = ["Wheat 🌾", "Mustard 🌼", "Barley", "Peas", "Chickpea"]
            advice = "Ideal Rabi conditions! Great time to sow wheat and mustard."
        elif temp < 25:
            crops = ["Wheat 🌾", "Potato 🥔", "Tomato 🍅", "Onion 🧅", "Carrot"]
            advice = "Good conditions for Rabi vegetables. Ensure timely irrigation."
        else:
            crops = ["Mustard 🌼", "Chickpea", "Lentils", "Coriander"]
            advice = "Slightly warm for Rabi — choose heat-tolerant varieties."

    # Zaid season (April - June)
    else:
        season = "Zaid (जायद)"
        crops = ["Watermelon 🍉", "Cucumber 🥒", "Pumpkin", "Bitter Gourd", "Moong Dal"]
        advice = "Zaid season — focus on short-duration crops and summer vegetables."

    return {
        "season": season,
        "recommended_crops": crops,
        "seasonal_advice": advice,
        "month": datetime.datetime.now().strftime("%B")
    }

@router.get("/forecast")
def get_forecast(city: str = "Delhi"):
    try:
        url = "https://api.openweathermap.org/data/2.5/forecast"
        params = {
            "q": f"{city},IN",
            "appid": WEATHER_API_KEY,
            "units": "metric",
            "cnt": 5
        }
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if response.status_code != 200:
            return {"error": "City not found"}

        forecasts = []
        for item in data["list"][:5]:
            forecasts.append({
                "time": item["dt_txt"],
                "temp": round(item["main"]["temp"]),
                "description": item["weather"][0]["description"].title(),
                "icon": item["weather"][0]["icon"],
                "humidity": item["main"]["humidity"],
            })

        return {"city": city, "forecasts": forecasts}
    except Exception as e:
        return {"error": str(e)}