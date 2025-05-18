from model.user import User  # adjust if needed
from database import SessionLocal  # this should return a sessionmaker
from util import hash_password
from datetime import date

# Create a new database session
db = SessionLocal()

# Create a new user instance
new_user = User(
    username="exampleuser",
    hashed_password=hash_password("examplepassword"),
    birthday=date(1999, 5, 13)  # Example birthday
)

# Add to DB
db.add(new_user)
db.commit()
db.refresh(new_user)

print(f"✅ Created user: {new_user.username}, ID: {new_user.id}")
