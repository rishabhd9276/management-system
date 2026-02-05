from fastapi import FastAPI, HTTPException, status, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from database import db
from schemas import Employee, EmployeeCreate, Attendance, AttendanceCreate
from bson import ObjectId
import datetime

app = FastAPI(title="HRMS Lite API")

# CORS
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",
    "*" # For ease of development, restrict in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Employee Endpoints ---

@app.post("/employees/", response_model=Employee, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate):
    # Check for duplicates (email or employee_id)
    existing_email = await db.employees.find_one({"email": employee.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_id = await db.employees.find_one({"employee_id": employee.employee_id})
    if existing_id:
        raise HTTPException(status_code=400, detail="Employee ID already exists")

    employee_dict = employee.dict()
    new_employee = await db.employees.insert_one(employee_dict)
    created_employee = await db.employees.find_one({"_id": new_employee.inserted_id})
    return created_employee

@app.get("/employees/", response_model=List[Employee])
async def read_employees():
    pipeline = [
        {
            "$lookup": {
                "from": "attendance",
                "localField": "employee_id",
                "foreignField": "employee_id",
                "as": "attendance_records"
            }
        },
        {
            "$addFields": {
                "total_present": {
                    "$size": {
                        "$filter": {
                            "input": "$attendance_records",
                            "as": "att",
                            "cond": { "$eq": ["$$att.status", "Present"] }
                        }
                    }
                }
            }
        },
        {
            "$project": {
                "attendance_records": 0
            }
        }
    ]
    employees = await db.employees.aggregate(pipeline).to_list(1000)
    return employees

@app.get("/employees/{employee_id}", response_model=Employee)
async def read_employee(employee_id: str):
    # Search by custom employee_id (string), not ObjectId
    employee = await db.employees.find_one({"employee_id": employee_id})
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@app.delete("/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str):
    # Delete employee
    delete_result = await db.employees.delete_one({"employee_id": employee_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Also delete associated attendance records
    await db.attendance.delete_many({"employee_id": employee_id})
    return None

# --- Attendance Endpoints ---

@app.post("/attendance/", response_model=Attendance, status_code=status.HTTP_201_CREATED)
async def mark_attendance(attendance: AttendanceCreate):
    # Verify employee exists
    employee = await db.employees.find_one({"employee_id": attendance.employee_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check if attendance already marked for this date
    # Date is date object in pydantic, usually comes as YYYY-MM-DD string
    # MongoDB stores dates as datetime usually, but we can store as string or ISO date.
    # Pydantic .dict() converts date to date object. Motor handles it but sometimes string is easier for exact match query without time.
    # Let's convert date to string for storage to avoid timezone complexity for simple daily attendance.
    attendance_dict = attendance.dict()
    attendance_dict['date'] = attendance.date.isoformat() 

    existing_record = await db.attendance.find_one({
        "employee_id": attendance.employee_id,
        "date": attendance_dict['date']
    })

    if existing_record:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")

    new_attendance = await db.attendance.insert_one(attendance_dict)
    created_attendance = await db.attendance.find_one({"_id": new_attendance.inserted_id})
    return created_attendance

@app.get("/attendance/{employee_id}", response_model=List[Attendance])
async def read_attendance(employee_id: str):
    records = await db.attendance.find({"employee_id": employee_id}).to_list(1000)
    return records

@app.get("/attendance/", response_model=List[Attendance])
async def read_all_attendance(date: Optional[str] = None):
    # Bonus: View all attendance or filter
    query = {}
    if date:
        query["date"] = date
        
    records = await db.attendance.find(query).to_list(1000)
    return records

# --- Dashboard Endpoints ---

@app.get("/dashboard/summary")
async def get_dashboard_summary():
    total_employees = await db.employees.count_documents({})
    
    today = datetime.date.today().isoformat()
    present_today = await db.attendance.count_documents({
        "date": today, 
        "status": "Present"
    })
    
    return {
        "total_employees": total_employees,
        "present_today": present_today
    }
