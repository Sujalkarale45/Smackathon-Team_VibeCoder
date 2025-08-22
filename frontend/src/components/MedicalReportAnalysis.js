import React, { useState } from 'react';
import axios from 'axios';
import FormattedOutput from './FormattedOutput';

const MedicalReportAnalysis = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a medical report image');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/medical-report-analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while analyzing the medical report');
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const content = `Medical Report Analysis\n\n${result.analysis}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medical-report-analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2>Medical Report Analysis</h2>
      </div>
      
      <div className="tool-content">
        <div className="disclaimer" style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          color: '#856404'
        }}>
          <strong>⚠️ Privacy & Medical Disclaimer:</strong> This tool analyzes medical reports for educational purposes only. All analysis should be verified with qualified healthcare professionals. Do not upload sensitive personal information if privacy is a concern.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Upload Medical Report</label>
            <div className="file-input">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                required
              />
              <label className="file-input-label">
                {file ? file.name : 'Click to select medical report (PNG, JPG, JPEG, PDF)'}
              </label>
            </div>
            <small style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
              Supported formats: Blood tests, X-rays, MRI reports, lab results, etc.
            </small>
          </div>
          
          <button 
            type="submit" 
            className="primary-button"
            disabled={loading}
          >
            {loading ? 'Analyzing Report...' : 'Analyze Medical Report'}
          </button>
        </form>

        {loading && (
          <div className="loading">
            Analyzing medical report with AI...
          </div>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {result && (
          <div className="results-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Medical Report Analysis</h3>
              <button className="secondary-button" onClick={downloadResult}>
                Download Analysis
              </button>
            </div>
            
            <div className="results-content">
              <FormattedOutput 
                content={result.analysis} 
                title="Medical Report Analysis" 
              />
            </div>
            
            <div style={{ 
              background: '#f3e5f5', 
              border: '1px solid #9c27b0', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginTop: '1rem',
              color: '#6a1b9a'
            }}>
              <strong>Important Reminders:</strong>
              <ul style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                <li>This analysis is for informational purposes only</li>
                <li>Always discuss results with your healthcare provider</li>
                <li>Do not make medical decisions based solely on this analysis</li>
                <li>Contact your doctor if you have concerns about any findings</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalReportAnalysis;
