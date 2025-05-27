# model/__init__.py
from .user import User, UserInDB, UserResponse
from .weather import WeatherData, WeatherRequest, WeatherCity

__all__ = [
    "User", "UserInDB", "UserResponse",
    "WeatherData", "WeatherRequest", "WeatherCity"
]
