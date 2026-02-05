import { useState, useEffect } from 'react';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await deleteEmployee(id);
      setEmployees(employees.filter((emp) => emp.employee_id !== id));
    } catch (err) {
      alert('Failed to delete employee');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createEmployee(formData);
      setEmployees([...employees, response.data]);
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add employee');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>

      {/* Add Employee Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID"
            value={formData.employee_id}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="md:col-span-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Add Employee
          </button>
        </form>
      </div>

      {/* Employee List */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Employee List</h2>
        {employees.length === 0 ? (
          <p className="text-gray-500">No employees found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Department</th>
                <th className="p-3">Total Present</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.employee_id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{emp.employee_id}</td>
                  <td className="p-3">{emp.full_name}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.department}</td>
                  <td className="p-3 text-center">
                    <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-semibold">
                        {emp.total_present || 0} days
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(emp.employee_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
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

export default EmployeeList;
