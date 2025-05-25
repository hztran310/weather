#model/user.py
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from model.base import Base
from util import verify_password
from typing import Optional
from pydantic import BaseModel
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    birthday = Column(Date, nullable=True)
    hashed_password = Column(String)

    weather_data = relationship("WeatherData", back_populates="owner")
    saved_cities = relationship("WeatherCity", back_populates="owner")

    def verify_password(self, password: str):
        return verify_password(password, self.hashed_password)


class Token(Base):
    __tablename__ = "tokens"
    access_token = Column(String, primary_key=True, index=True)
    token_type = Column(String, default="bearer")


class TokenData(Base):
    __tablename__ = "token_data"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=True)


class UserInDB(BaseModel):
    username: str
    hashed_password: str
    birthday: Optional[datetime.date]

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    username: str
    birthday: Optional[datetime.date]

    class Config:
        from_attributes = True
