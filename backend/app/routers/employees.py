# pyright: reportMissingImports=false
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("/", response_model=List[schemas.EmployeeOut])
def list_employees(department: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Employee)
    if department:
        query = query.filter(models.Employee.department == department)
    return query.all()


@router.get("/{employee_id}", response_model=schemas.EmployeeOut)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.post("/", response_model=schemas.EmployeeOut)
def create_employee(employee: schemas.EmployeeIn, db: Session = Depends(get_db)):
    db_employee = models.Employee(**employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


@router.get("/{employee_id}/events")
def get_employee_events(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return [{"id": e.id, "event_type": e.event_type, "timestamp": e.timestamp} for e in employee.events]