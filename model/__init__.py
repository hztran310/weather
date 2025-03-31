# models/__init__.py
from .user import User
from .weather import WeatherData, WeatherRequest

# This ensures all models are loaded before relationships are resolved
__all__ = ['User', 'WeatherData', 'WeatherRequest']