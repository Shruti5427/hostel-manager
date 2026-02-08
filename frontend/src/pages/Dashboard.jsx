import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [userRole, setUserRole] = useState('student'); // Default to student
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ask: "Who am I?"
        const userRes = await api.get('/users/me');
        setUserRole(userRes.data.role); // Save "student" or "warden"

        // 2. Fetch the issues
        const issuesRes = await api.get('/issues/');
        setIssues(issuesRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
        if (err.response && err.response.status === 401) {
          navigate('/'); // Kick out if token is bad
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Warden Action: Mark as Resolved
  const handleResolve = async (issueId) => {
    try {
      await api.put(`/issues/${issueId}/resolve`);
      // Update the UI instantly without reloading
      setIssues(issues.map(issue => 
        issue.id === issueId ? { ...issue, status: 'Resolved' } : issue
      ));
    } catch (err) {
      alert("Failed to resolve issue. Are you sure you are a Warden?");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className={`text-white p-4 flex justify-between items-center shadow-md ${
        userRole === 'warden' ? 'bg-purple-700' : 'bg-blue-600'
      }`}>
        <h1 className="text-xl font-bold">
          {userRole === 'warden' ? '👮 Warden Dashboard' : '🎓 Student Portal'}
        </h1>
        <div className="flex gap-4">
          {/* Only Students see the "Report" button */}
          {userRole !== 'warden' && (
            <button 
                onClick={() => navigate('/report')}
                className="bg-white text-blue-600 px-4 py-2 rounded text-sm font-bold hover:bg-gray-100 transition"
            >
                + Report Issue
            </button>
          )}
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {userRole === 'warden' ? 'Pending Actions' : 'My Complaints'}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              {issue.image_url ? (
                <img src={issue.image_url} alt={issue.title} className="w-full h-48 object-cover"/>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
              )}

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
                
                {/* THE WARDEN BUTTON */}
                {userRole === 'warden' && issue.status !== 'Resolved' && (
                  <button 
                    onClick={() => handleResolve(issue.id)}
                    className="w-full mt-4 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition"
                  >
                    ✅ Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;