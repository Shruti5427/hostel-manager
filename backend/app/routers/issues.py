from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, crud, auth, utils
from app.database import get_db
from app.auth import get_current_user

router = APIRouter(prefix="/issues", tags=["issues"])


@router.get("/", response_model=List[schemas.IssueResponse])
def read_issues(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_issues(db, skip=skip, limit=limit)


@router.post("/", response_model=schemas.IssueResponse)
def create_issue(
    title: str = Form(...),
    description: str = Form(...),
    wing: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    image_url = utils.upload_image(file) if file else None
    issue_data = schemas.IssueCreate(
        title=title, description=description, wing=wing, image_url=image_url
    )
    return crud.create_issue(db=db, issue=issue_data, user_id=current_user.id)


@router.put("/{issue_id}/resolve")
def resolve_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "warden":
        raise HTTPException(status_code=403, detail="Only Wardens can resolve issues")

    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    issue.status = "Resolved"
    db.commit()
    return {"message": "Issue resolved successfully", "status": "Resolved"}
