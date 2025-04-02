# models/__init__.py
from .user import User, UserInDB, Token, TokenData, UserResponse  # Import User and related classes
from .weather import WeatherData, WeatherRequest

# This ensures all models are loaded before relationships are resolved
__all__ = ['User', 'WeatherData', 'WeatherRequest', 'UserInDB', 'Token', 'TokenData', 'UserResponse']