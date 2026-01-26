from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables

# For local dev, you can use a local Postgres URL. 
# Format: postgresql://user:password@localhost/dbname
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db") 

# NOTE: I put SQLite as default above so you can run this IMMEDIATELY without 
# installing Postgres right this second. Switch to Postgres URL when ready.

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    # connect_args={"check_same_thread": False} # Uncomment this ONLY for SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session in endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()