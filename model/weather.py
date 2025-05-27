#model/weather.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from model.base import Base
from datetime import datetime
from pydantic import BaseModel

class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, index=True)
    temperature = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="weather_data")


class WeatherCity(Base):
    __tablename__ = "weather_city"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="saved_cities")


class WeatherRequest(BaseModel):
    city: str

    class Config:
        from_attributes = True
