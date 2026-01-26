from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_warden = Column(Boolean, default=False)  # True = Admin/Warden, False = Student

    # Relationship: A user can report many issues
    issues = relationship("Issue", back_populates="reporter")


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    wing = Column(String)  # e.g., "Wing A"
    status = Column(String, default="Pending")  # Pending, In Progress, Resolved
    image_url = Column(String, nullable=True)  # URL to the uploaded image
    created_at = Column(DateTime, default=datetime.utcnow)

    reporter_id = Column(Integer, ForeignKey("users.id"))

    reporter = relationship("User", back_populates="issues")
