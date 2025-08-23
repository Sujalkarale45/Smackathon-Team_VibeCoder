import React, { useState } from 'react';
import axios from 'axios';
import FormattedOutput from './FormattedOutput';

const MedicineAnalyzer = ({ onBack, language }) => {
  const [inputType, setInputType] = useState('text');
  const [medicineName, setMedicineName] = useState('');
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
    
    if (inputType === 'text' && !medicineName.trim()) {
      setError('Please enter a medicine name');
      return;
    }
    
    if (inputType === 'image' && !file) {
      setError('Please select a medicine image');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    
    if (inputType === 'text') {
      formData.append('medicine_name', medicineName);
    } else {
      formData.append('file', file);
    }
    formData.append('language', language || 'en');

    try {
      const response = await axios.post('/api/medicine-analyzer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while analyzing the medicine');
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const content = `Medicine Analysis Report\n\n${result.analysis}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medicine-analysis.txt';
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
        <h2>Medicine Analyzer</h2>
      </div>
      
      <div className="tool-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Input Type</label>
            <select 
              value={inputType} 
              onChange={(e) => setInputType(e.target.value)}
            >
              <option value="text">Medicine Name</option>
              <option value="image">Medicine Image</option>
            </select>
          </div>

          {inputType === 'text' ? (
            <div className="form-group">
              <label>Medicine Name</label>
              <input
                type="text"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder="Enter medicine name (e.g., Paracetamol, Aspirin)"
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Upload Medicine Image</label>
              <div className="file-input">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                <label className="file-input-label">
                  {file ? file.name : 'Click to select medicine image (PNG, JPG, JPEG)'}
                </label>
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className="primary-button"
            disabled={loading}
          >
            {loading ? 'Analyzing Medicine...' : 'Analyze Medicine'}
          </button>
        </form>

        {loading && (
          <div className="loading">
            Analyzing medicine with AI...
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
              <h3>Medicine Analysis Results</h3>
              <button className="secondary-button" onClick={downloadResult}>
                Download Results
              </button>
            </div>
            
            <div className="results-content">
              <FormattedOutput 
                content={result.analysis} 
                title="Medicine Analysis Results" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineAnalyzer;
