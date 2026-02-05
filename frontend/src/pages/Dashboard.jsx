import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState({ total_employees: 0, present_today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getDashboardSummary();
        setSummary(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-600">Total Employees</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">{summary.total_employees}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-gray-600">Present Today</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">{summary.present_today}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Welcome to HRMS Lite</h2>
        <p className="text-gray-600">Use the navigation bar to manage employees and track attendance.</p>
      </div>
    </div>
  );
};

export default Dashboard;
