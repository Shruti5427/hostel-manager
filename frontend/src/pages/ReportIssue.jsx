import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function ReportIssue() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [wing, setWing] = useState('Wing A'); // Default value
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. We must use FormData because we are sending a file
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('wing', wing);
      if (file) {
        formData.append('file', file);
      }

      // 2. Send to Backend
      await api.post('/issues/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for files
        },
      });

      // 3. Success! Go back to dashboard
      navigate('/dashboard');
      
    } catch (err) {
      console.error("Failed to report issue", err);
      alert("Failed to report issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Report Hygiene Issue</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Broken Tap"
              required 
            />
          </div>

          {/* Wing Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Hostel Wing</label>
            <select 
              value={wing}
              onChange={(e) => setWing(e.target.value)}
              className="w-full mt-1 p-2 border rounded bg-white"
            >
              <option>Wing A</option>
              <option>Wing B</option>
              <option>Wing C</option>
              <option>Kitchen</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 border rounded h-24"
              placeholder="Describe the issue..."
              required 
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Photo Proof (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="w-1/3 py-2 text-gray-700 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`w-2/3 py-2 text-white rounded font-bold ${
                loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Uploading...' : 'Submit Report'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ReportIssue;