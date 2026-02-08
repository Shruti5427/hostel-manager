from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash  # Import the hasher


def get_issues(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Issue).offset(skip).limit(limit).all()


# Inside app/crud.py


def create_issue(db: Session, issue: schemas.IssueCreate, user_id: int):
    db_issue = models.Issue(
        title=issue.title,
        description=issue.description,
        wing=issue.wing,
        image_url=issue.image_url,
        status="Pending",
        reporter_id=user_id,  # Link the issue to the logged-in user
    )
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    is_warden = user.role.strip().lower() == "warden"
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        is_warden=is_warden,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
