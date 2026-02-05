import { useState, useEffect } from 'react';
import { getEmployees, markAttendance, getAllAttendance } from '../services/api';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });

  useEffect(() => {
    fetchData();
  }, [filterDate]);

  const fetchData = async () => {
    try {
      // If we are filtering, we might not need to re-fetch employees every time, but for simplicity we keep it.
      // Optimization: Fetch employees only once on mount.
      
      const attRes = await getAllAttendance(filterDate);
      
      // Only fetch employees if we haven't yet (initial load)
      if (employees.length === 0) {
          const empRes = await getEmployees();
          setEmployees(empRes.data);
      }
      
      setAttendanceRecords(attRes.data);
      setLoading(false);
    } catch (err) {
      alert('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id) {
        alert("Please select an employee");
        return;
    }
    try {
      const response = await markAttendance(formData);
      setAttendanceRecords([...attendanceRecords, response.data]);
      alert('Attendance marked successfully');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to mark attendance');
    }
  };

  // Helper to get employee name by ID
  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.employee_id === id);
    return emp ? emp.full_name : id;
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>

      {/* Mark Attendance Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Employee</label>
            <select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Mark Attendance
          </button>
        </form>
      </div>

      {/* Attendance Records */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Attendance Records</h2>
            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Filter by Date:</label>
                <input 
                    type="date" 
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="border p-2 rounded text-sm"
                />
                {filterDate && (
                    <button 
                        onClick={() => setFilterDate('')}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
        
        {attendanceRecords.length === 0 ? (
          <p className="text-gray-500">No attendance records found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">Date</th>
                <th className="p-3">Employee Name</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Sort by date descending */}
              {[...attendanceRecords]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((record, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{record.date}</td>
                  <td className="p-3">{getEmployeeName(record.employee_id)}</td>
                  <td className={`p-3 font-medium ${record.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                    {record.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Attendance;
