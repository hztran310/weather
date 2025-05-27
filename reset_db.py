# reset_db.py
from model.base import Base
from database import engine
import model.user
import model.weather

print("🔄 Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("✅ Dropped.")

print("📦 Creating all tables...")
print("All model tables:", Base.metadata.tables)
print("Tables to create:", Base.metadata.tables.keys())  # should now show all model tables
Base.metadata.create_all(bind=engine)
print("✅ Done.")
