from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import requests
from database import get_db
from model import WeatherData, User  # Import UserResponse here
from auth import create_access_token, hash_password, get_current_user, authenticate_user
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date

class CityRequest(BaseModel):
    city: str


# FastAPI app
app = FastAPI()


# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (or set your frontend URL)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

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
        "temp_max": data["main"]["temp_max"],  # High temperature
        "temp_min": data["main"]["temp_min"],  # Low temperature
        "description": data["weather"][0]["description"],  # Weather forecast description
        "feels_like": data["main"]["feels_like"],  # Feels like temperature
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "wind_direction": data["wind"].get("deg", "N/A"),  # Wind direction (if available)
        "precipitation": data.get("rain", {}).get("1h", 0),  # Precipitation (1h)
        "sunset": data["sys"]["sunset"],  # Sunset time (in UTC)
        "timezone_offset": data.get("timezone", 0),  # Ensure this field is added to the response
        "lat": data["coord"]["lat"],  # Latitude
        "lon": data["coord"]["lon"],  # Longitude


    }
     
    return weather_info

    
@app.post("/register")
def register(username: str, password: str, birthday: date, db: Session = Depends(get_db)):
    hashed_password = hash_password(password)
    db_user = User(username=username, hashed_password=hashed_password, birthday=birthday)  # Use UserInDB
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

@app.post("/weather/store")
def store_weather(
    request: CityRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # Ensure user is authenticated
):
    city = request.city
    weather = get_weather(city)  # Get weather from API
    
    if not weather:
        raise HTTPException(status_code=404, detail="Weather data not found")

    # Save to database with user_id
    new_weather = WeatherData(
        city=weather["city"],
        temperature=weather["temperature"],
        humidity=weather["humidity"],
        wind_speed=weather["wind_speed"],
        user_id=current_user.id  # ✅ Fix: Store the user who added the data
    )
    
    db.add(new_weather)
    db.commit()
    return {"message": "Weather data saved successfully"}

@app.get("/weather/my_data")
def get_user_weather_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Fetch weather data associated with the current user
    weather_data = db.query(WeatherData).filter(WeatherData.user_id == current_user.id).all()
    
    if not weather_data:
        raise HTTPException(status_code=404, detail="No weather data found for this user")
    
    return weather_data
