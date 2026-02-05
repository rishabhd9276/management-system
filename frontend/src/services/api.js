import axios from 'axios';

let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Ensure the URL has a protocol (Render 'host' property returns just the domain)
if (apiUrl && !apiUrl.startsWith('http')) {
  apiUrl = `https://${apiUrl}`;
}

const API_URL = apiUrl;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getEmployees = () => api.get('/employees/');
export const createEmployee = (data) => api.post('/employees/', data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
export const getEmployee = (id) => api.get(`/employees/${id}`);

export const getAttendance = (employeeId) => api.get(`/attendance/${employeeId}`);
export const getAllAttendance = (date = null) => {
  const params = date ? { date } : {};
  return api.get('/attendance/', { params });
};
export const markAttendance = (data) => api.post('/attendance/', data);

export const getDashboardSummary = () => api.get('/dashboard/summary');

export default api;
