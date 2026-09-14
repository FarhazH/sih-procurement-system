from database import engine
from models import Base

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("All tables dropped.")

print("Recreating all tables...")
Base.metadata.create_all(bind=engine)
print("All tables recreated successfully!")
