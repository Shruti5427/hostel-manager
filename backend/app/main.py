from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from fastapi.security import OAuth2PasswordRequestForm
from . import models, schemas, crud, database, auth
from fastapi import File, UploadFile, Form
from . import utils
from fastapi.middleware.cors import CORSMiddleware
from .auth import get_current_user

app = FastAPI()


origins = [
    "http://localhost:5173",  # The address of your React App
    "http://127.0.0.1:5173",
]

"""this middleware enables CORS for the specified origins."""
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers (Authentication, etc.)
)

# Create the database tables
models.Base.metadata.create_all(bind=database.engine)


# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Hostel Hygiene API is running!"}

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- AUTHENTICATION ENDPOINTS ---


@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/login", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    # Authenticate the user
    user = (
        db.query(models.User).filter(models.User.username == form_data.username).first()
    )

    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate the JWT Token
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


# --- ISSUE ENDPOINTS ---


# @app.post("/issues/", response_model=schemas.IssueResponse)
# def create_issue(
#     issue: schemas.IssueCreate,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(auth.get_current_user),  # PROTECTED ROUTE
# ):
#     # We pass the current_user.id to the crud function so we know who posted it
#     return crud.create_issue(db=db, issue=issue, user_id=current_user.id)


@app.get("/issues/", response_model=List[schemas.IssueResponse])
def read_issues(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Public route (anyone can see issues for now)
    issues = crud.get_issues(db, skip=skip, limit=limit)
    return issues


# @app.post("/issues/", response_model=schemas.IssueResponse)
# def create_issue(
#     title: str = Form(...),
#     description: str = Form(...),
#     wing: str = Form(...),
#     file: UploadFile = File(None),  # Optional file
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(auth.get_current_user),
# ):
#     # 1. Upload image if it exists
#     image_url = None
#     if file:
#         image_url = utils.upload_image(file)

#     # 2. Create the schema manually from Form data
#     issue_data = schemas.IssueCreate(
#         title=title, description=description, wing=wing, image_url=image_url
#     )


#     # 3. Save to DB
#     return crud.create_issue(db=db, issue=issue_data, user_id=current_user.id)
"""Create an issue with optional image upload."""


@app.post("/issues/", response_model=schemas.IssueResponse)
def create_issue(
    title: str = Form(...),
    description: str = Form(...),
    wing: str = Form(...),
    file: UploadFile = File(None),  # This handles the image
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    # 1. Upload image if it exists
    image_url = None
    if file:
        image_url = utils.upload_image(file)

    # 2. Bundle data into a Schema
    issue_data = schemas.IssueCreate(
        title=title, description=description, wing=wing, image_url=image_url
    )

    # 3. Save to Database
    return crud.create_issue(db=db, issue=issue_data, user_id=current_user.id)


# ... previous code ...

""" Resolve an issue (Warden only)."""


@app.put("/issues/{issue_id}/resolve")
def resolve_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # 1. Check if the user is a Warden
    if current_user.role != "warden":
        raise HTTPException(status_code=403, detail="Only Wardens can resolve issues")

    # 2. Find the issue
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    # 3. Update the status
    issue.status = "Resolved"
    db.commit()

    return {"message": "Issue resolved successfully", "status": "Resolved"}



