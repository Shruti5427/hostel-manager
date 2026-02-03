import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch Issues when the page loads
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await api.get('/issues/');
        setIssues(response.data);
      } catch (err) {
        console.error("Error fetching issues", err);
        // If the token is invalid, kick them out
        if (err.response && err.response.status === 401) {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <div className="p-8 text-center">Loading issues...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Hostel Manager</h1>
        <div className="flex gap-4">
            <button 
                onClick={() => navigate('/report')}
                className="bg-white text-blue-600 px-4 py-2 rounded text-sm font-bold hover:bg-gray-100 transition"
            >
                + Report Issue
            </button>
            <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold transition"
            >
                Logout
            </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Complaints</h2>

        {issues.length === 0 ? (
          <p className="text-gray-500 text-center">No issues reported yet. Good job!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <div key={issue.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {/* Image Section */}
                {issue.image_url ? (
                  <img 
                    src={issue.image_url} 
                    alt={issue.title} 
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                {/* Content Section */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900">{issue.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      issue.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">📍 {issue.wing}</p>
                  <p className="text-gray-700 mt-3 text-sm line-clamp-3">{issue.description}</p>
                  <p className="text-xs text-gray-400 mt-4 text-right">
                    Reported on: {new Date(issue.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;