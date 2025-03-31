#main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import requests
from database import get_db
from sqlalchemy.exc import SQLAlchemyError
from model import WeatherData, WeatherRequest  # Import weather models here
from auth import create_access_token, hash_password, get_current_user, verify_password

# FastAPI app
app = FastAPI()

# OpenWeather API Key
API_KEY = "b02beb5f6754f998a9d86759f9d5c3cf"

# Fetch weather data from OpenWeather API
@app.get("/weather")
def get_weather(city: str):
    URL = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(URL)

    if response.status_code != 200:
        return {"error": "City not found"}

    data = response.json()

    weather_info = {
        "city": city,
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
    }
    return weather_info

# Store weather data in the PostgreSQL database
@app.post("/weather/store")
def store_weather(weather: WeatherRequest, db: Session = Depends(get_db)):
    from model import User  # Import User here to avoid circular import issues
    city = weather.city
    weather_data = get_weather(city)

    if not weather_data:
        raise HTTPException(status_code=404, detail="Could not fetch weather data for the specified city")
    
    # Store in the database
    try:
        weather_entry = WeatherData(
            city=city,
            temperature=weather_data["temperature"],
            humidity=weather_data["humidity"],
            wind_speed=weather_data["wind_speed"],
        )
    except SQLAlchemyError as e:
        db.rollback()  # Rollback any changes if an error occurs
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

    db.add(weather_entry)
    db.commit()
    db.refresh(weather_entry)

    return {"message": "Weather data stored successfully", "data": weather_data}

# Register a new user (for testing purposes)
@app.post("/register")
def register(username: str, password: str, db: Session = Depends(get_db)):
    from model import User  # Import User here
    hashed_password = hash_password(password)
    db_user = User(username=username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"msg": "User created successfully"}

# Login and generate JWT token
@app.post("/token")
def login(username: str, password: str, db: Session = Depends(get_db)):
    from model import User  # Import User here
    user = db.query(User).filter(User.username == username).first()
    if not user or not user.verify_password(password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token
    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}
