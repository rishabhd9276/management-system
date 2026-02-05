from pydantic import BaseModel, EmailStr, Field, BeforeValidator
from datetime import date
from typing import List, Optional, Annotated
import enum

# Helper for handling ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]

class AttendanceStatus(str, enum.Enum):
    PRESENT = "Present"
    ABSENT = "Absent"

class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    employee_id: str 

class Attendance(AttendanceBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    employee_id: str

    class Config:
        populate_by_name = True
        json_encoders = {
            # Handle any custom types if needed
        }

class EmployeeBase(BaseModel):
    employee_id: str = Field(..., min_length=1)
    full_name: str = Field(..., min_length=1)
    email: EmailStr
    department: str = Field(..., min_length=1)

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    total_present: Optional[int] = 0
    # Attendance will be fetched separately or embedded depending on design.
    # For now, let's keep it simple.

    class Config:
        populate_by_name = True
