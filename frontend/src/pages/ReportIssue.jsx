import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  AlertCircle, 
  MapPin, 
  FileText, 
  Image as ImageIcon,
  X,
  Loader2
} from 'lucide-react';

function ReportIssue() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [wing, setWing] = useState('Wing A');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('wing', wing);
      if (file) {
        formData.append('file', file);
      }

      await api.post('/issues/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/dashboard');
      
    } catch (err) {
      console.error("Failed to report issue", err);
      alert("Failed to report issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <AlertCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
          <p className="text-gray-600">Help us maintain a better living environment</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-6">
              
              {/* Title Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FileText className="w-4 h-4" />
                  Issue Title
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="e.g., Broken tap in bathroom"
                  required 
                />
              </div>

              {/* Wing Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <select 
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer"
                >
                  <option>Wing A</option>
                  <option>Wing B</option>
                  <option>Wing C</option>
                  <option>Kitchen</option>
                  <option>Common Area</option>
                  <option>Bathroom</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FileText className="w-4 h-4" />
                  Description
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="Please describe the issue in detail..."
                  required 
                />
                <p className="text-xs text-gray-500 mt-2">
                  Be specific about the problem to help us resolve it faster
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <ImageIcon className="w-4 h-4" />
                  Photo Evidence (Optional)
                </label>
                
                {!previewUrl ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Click to upload photo
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                      {file?.name}
                    </div>
                  </div>
                )}
              </div>

              {/* Info Alert */}
              <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Quick Tip</p>
                  <p>Including a photo helps wardens understand and resolve issues faster.</p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-8 py-6 flex gap-4 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Your report will be reviewed by the hostel warden within 24 hours
        </p>
      </main>
    </div>
  );
}

export default ReportIssue;