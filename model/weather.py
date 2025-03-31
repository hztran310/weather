# weather.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from pydantic import BaseModel
from model.base import Base


class WeatherData(Base):
    __tablename__ = "weather_data"
    
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, index=True)
    temperature = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Foreign key to reference the User table
    user_id = Column(Integer, ForeignKey("users.id"))

    # Use string reference for relationship
    owner = relationship("User", back_populates="weather_data")
    
class WeatherRequest(BaseModel):
    city: str

    class Config:
        orm_mode = True