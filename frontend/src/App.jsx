import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EmployeeList from './pages/EmployeeList';
import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>&copy; {new Date().getFullYear()} HRMS Lite</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
