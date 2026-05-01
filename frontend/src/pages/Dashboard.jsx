import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Plus, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ImageOff,
  ShieldCheck,
  User,
  Loader2
} from 'lucide-react';

function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [userRole, setUserRole] = useState('student');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/users/me');
        setUserRole(userRes.data.role);

        const issuesRes = await api.get('/issues/');
        setIssues(issuesRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
        if (err.response && err.response.status === 401) {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleResolve = async (issueId) => {
    try {
      await api.put(`/issues/${issueId}/resolve`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingIssues = issues.filter(issue => issue.status !== 'Resolved');
  const resolvedIssues = issues.filter(issue => issue.status === 'Resolved');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`sticky top-0 z-10 border-b backdrop-blur-sm ${
        userRole === 'warden' 
          ? 'bg-indigo-600/95 border-indigo-700' 
          : 'bg-blue-600/95 border-blue-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                userRole === 'warden' ? 'bg-indigo-500' : 'bg-blue-500'
              }`}>
                {userRole === 'warden' ? (
                  <ShieldCheck className="w-6 h-6 text-white" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">
                  {userRole === 'warden' ? 'Warden Dashboard' : 'My Complaints'}
                </h1>
                <p className="text-white/80 text-xs">
                  {userRole === 'warden' ? 'Manage all hostel issues' : 'Track your reports'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {userRole !== 'warden' && (
                <button 
                  onClick={() => navigate('/report')}
                  className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Report Issue</span>
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{pendingIssues.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{resolvedIssues.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Issues Grid */}
        {issues.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No issues yet</h3>
            <p className="text-gray-600 mb-6">
              {userRole === 'warden' 
                ? 'All caught up! No pending complaints.' 
                : 'You haven\'t reported any issues yet.'}
            </p>
            {userRole !== 'warden' && (
              <button 
                onClick={() => navigate('/report')}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Report Your First Issue
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <div 
                key={issue.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                {issue.image_url ? (
                  <div className="relative h-48 bg-gray-100">
                    <img 
                      src={issue.image_url} 
                      alt={issue.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
                        issue.status === 'Resolved' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-400 text-yellow-900'
                      }`}>
                        {issue.status === 'Resolved' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {issue.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <ImageOff className="w-12 h-12 text-gray-400" />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
                        issue.status === 'Resolved' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-400 text-yellow-900'
                      }`}>
                        {issue.status === 'Resolved' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {issue.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                    {issue.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{issue.wing}</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {issue.description}
                  </p>
                  
                  {/* Warden Action Button */}
                  {userRole === 'warden' && issue.status !== 'Resolved' && (
                    <button 
                      onClick={() => handleResolve(issue.id)}
                      className="w-full mt-4 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;