from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from util import verify_password
from model.base import Base
from typing import Optional
from pydantic import BaseModel  # Pydantic import for serialization

# Define the User model here
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    
    # Use string reference for relationship
    weather_data = relationship("WeatherData", back_populates="owner")

    def verify_password(self, password: str):
        return verify_password(password, self.hashed_password)


class Token(Base):
    __tablename__ = "tokens"
    access_token = Column(String, primary_key=True, index=True)
    token_type = Column(String, default="bearer")


class TokenData(Base):
    __tablename__ = "token_data"
    id = Column(Integer, primary_key=True, index=True)
    username: Mapped[Optional[str]] = mapped_column(String, nullable=True)


class UserInDB(User):
    hashed_password = Column(String)


# Pydantic model to serialize the User response data
class UserResponse(BaseModel):  # No SQLAlchemy here
    id: int
    username: str
    
    class Config:
        orm_mode = True  # This tells Pydantic to treat ORM models as dictionaries for serialization
