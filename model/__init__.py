# model/__init__.py
from .user import User, UserInDB, Token, TokenData, UserResponse
from .weather import WeatherData, WeatherRequest, WeatherCity

__all__ = [
    "User", "UserInDB", "Token", "TokenData", "UserResponse",
    "WeatherData", "WeatherRequest", "WeatherCity"
]
