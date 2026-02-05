import requests
import json
from datetime import date

BASE_URL = "http://localhost:8000"

def test_api():
    print("Running API Tests...")

    # 1. Create Employee
    emp_data = {
        "employee_id": "EMP001",
        "full_name": "John Doe",
        "email": "john@example.com",
        "department": "Engineering"
    }
    
    # Clean up first if exists
    try:
        requests.delete(f"{BASE_URL}/employees/EMP001")
    except:
        pass

    print("\n1. Creating Employee...")
    response = requests.post(f"{BASE_URL}/employees/", json=emp_data)
    if response.status_code == 201:
        print("✅ Employee Created:", response.json())
    else:
        print("❌ Failed to create employee:", response.text)
        return

    # 2. Get Employees
    print("\n2. Fetching Employees...")
    response = requests.get(f"{BASE_URL}/employees/")
    if response.status_code == 200:
        employees = response.json()
        print(f"✅ Found {len(employees)} employees")
        found = any(e['employee_id'] == 'EMP001' for e in employees)
        if found:
            print("✅ Created employee found in list")
        else:
            print("❌ Created employee NOT found in list")
    else:
        print("❌ Failed to fetch employees")

    # 3. Mark Attendance
    print("\n3. Marking Attendance...")
    today = date.today().isoformat()
    att_data = {
        "employee_id": "EMP001",
        "date": today,
        "status": "Present"
    }
    # Clean up attendance if exists (though delete employee should have cascaded, but just in case)
    # The current API doesn't have a delete attendance by ID easily accessible without ID, 
    # but we just deleted the employee so attendance should be gone.
    
    response = requests.post(f"{BASE_URL}/attendance/", json=att_data)
    if response.status_code == 201:
        print("✅ Attendance Marked:", response.json())
    else:
        print("❌ Failed to mark attendance:", response.text)

    # 4. Get Attendance
    print("\n4. Fetching Attendance...")
    response = requests.get(f"{BASE_URL}/attendance/EMP001")
    if response.status_code == 200:
        records = response.json()
        print(f"✅ Found {len(records)} attendance records for EMP001")
        if len(records) > 0 and records[0]['status'] == "Present":
             print("✅ Attendance record verified")
    else:
         print("❌ Failed to fetch attendance")

    # 5. Delete Employee
    print("\n5. Deleting Employee...")
    response = requests.delete(f"{BASE_URL}/employees/EMP001")
    if response.status_code == 204:
        print("✅ Employee Deleted")
    else:
        print("❌ Failed to delete employee:", response.text)

    # 6. Verify Deletion
    response = requests.get(f"{BASE_URL}/employees/EMP001")
    if response.status_code == 404:
        print("✅ Deletion Verified (Employee not found)")
    else:
        print("❌ Employee still exists after deletion")

if __name__ == "__main__":
    try:
        test_api()
    except Exception as e:
        print(f"❌ Error running tests: {e}")
        print("Make sure the backend is running on http://localhost:8000")
