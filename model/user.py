#model/user.py
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from model.base import Base
from util import verify_password
from typing import Optional
from pydantic import BaseModel
from typing import Optional
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


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"    


class TokenData(BaseModel):
    username: Optional[str] = None


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
