# reset_db.py
from database import Base, engine
from model import UserInDB, WeatherData  # import all models

print("🔄 Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("✅ Dropped.")

print("📦 Creating all tables...")
Base.metadata.create_all(bind=engine)
print("✅ Done.")
