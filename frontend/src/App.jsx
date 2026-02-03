import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Import it
import ReportIssue from './pages/ReportIssue';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add this line */}
        <Route path="/report" element={<ReportIssue />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;