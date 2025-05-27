from fastapi import FastAPI, Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
import requests
from database import get_db
from model import WeatherData, User, WeatherCity  # Import UserResponse here
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

router = APIRouter()

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
@router.get("/weather")
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

    
class RegisterRequest(BaseModel):
    username: str
    password: str
    birthday: date

@router.post("/register")
def register(user: RegisterRequest, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password, birthday=user.birthday)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"msg": "User created successfully"}


# Login and generate JWT token
@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    username = form_data.username
    password = form_data.password
    user = authenticate_user(db, username, password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/weather/store")
def store_city(
    request: CityRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(WeatherCity).filter_by(user_id=current_user.id, city=request.city).first()
    if existing:
        return {"message": "City already stored."}

    new_entry = WeatherCity(city=request.city, user_id=current_user.id)
    db.add(new_entry)
    db.commit()
    return {"message": "City stored successfully."}

@router.get("/weather/my_data")
def get_saved_cities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    saved = db.query(WeatherCity).filter_by(user_id=current_user.id).all()
    return [{"id": s.id, "city": s.city} for s in saved]

@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "birthday": current_user.birthday
    }


app.include_router(router)

