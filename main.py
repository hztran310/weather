from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import requests
from database import get_db
from model import WeatherData, WeatherRequest, User, UserResponse, UserInDB  # Import UserResponse here
from auth import create_access_token, hash_password, get_current_user, authenticate_user, get_current_active_user
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

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

# Register a new user (for testing purposes)
@app.post("/register")
def register(username: str, password: str, db: Session = Depends(get_db)):
    hashed_password = hash_password(password)
    db_user = UserInDB(username=username, hashed_password=hashed_password)  # Use UserInDB
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"msg": "User created successfully"}

# Login and generate JWT token

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    username = form_data.username
    password = form_data.password
    user = authenticate_user(db, username, password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}



# Get current user
@app.get("/weather/me", response_model=UserResponse)
async def read_current_user(current_user: User = Depends(get_current_active_user)):
    """
    Get the current logged-in user.
    """
    return current_user
