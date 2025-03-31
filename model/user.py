# user.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from util import verify_password
from model.base import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    # Use string reference for relationship
    weather_data = relationship("WeatherData", back_populates="owner")

    def verify_password(self, password: str):
        return verify_password(password, self.hashed_password)