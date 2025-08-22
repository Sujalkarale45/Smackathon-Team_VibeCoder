import React, { useState } from 'react';
import axios from 'axios';
import FormattedOutput from './FormattedOutput';

const PrescriptionDetector = ({ onBack }) => {
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
      setError('Please select a prescription image');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/prescription-detector', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while processing the prescription');
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const content = JSON.stringify(result, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prescription-analysis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatMedicines = (medicines) => {
    if (!medicines || !Array.isArray(medicines)) return 'No medicines found';
    
    return medicines.map((med, index) => (
      `Medicine ${index + 1}:
      Name: ${med.name || 'Not specified'}
      Dosage: ${med.dosage || 'Not specified'}
      Timing: ${med.timing || 'Not specified'}
      Duration: ${med.duration || 'Not specified'}
      Instructions: ${med.instructions || 'Not specified'}`
    )).join('\n\n');
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2>Prescription Detector</h2>
      </div>
      
      <div className="tool-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Upload Prescription Image</label>
            <div className="file-input">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <label className="file-input-label">
                {file ? file.name : 'Click to select prescription image (PNG, JPG, JPEG)'}
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="primary-button"
            disabled={loading}
          >
            {loading ? 'Analyzing Prescription...' : 'Analyze Prescription'}
          </button>
        </form>

        {loading && (
          <div className="loading">
            Processing prescription image with AI...
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
              <h3>Prescription Analysis Results</h3>
              <button className="secondary-button" onClick={downloadResult}>
                Download Results
              </button>
            </div>
            
            <div className="results-content">
              {result.medicines && (
                <div>
                  <h4>Medicines:</h4>
                  <pre>{formatMedicines(result.medicines)}</pre>
                </div>
              )}
              
              {result.doctor_name && result.doctor_name !== 'Not specified' && (
                <div>
                  <h4>Doctor:</h4>
                  <p>{result.doctor_name}</p>
                </div>
              )}
              
              {result.patient_name && result.patient_name !== 'Not specified' && (
                <div>
                  <h4>Patient:</h4>
                  <p>{result.patient_name}</p>
                </div>
              )}
              
              {result.date && result.date !== 'Not specified' && (
                <div>
                  <h4>Date:</h4>
                  <p>{result.date}</p>
                </div>
              )}
              
              {result.precautions && result.precautions.length > 0 && (
                <div>
                  <h4>Precautions:</h4>
                  <ul>
                    {result.precautions.map((precaution, index) => (
                      <li key={index}>{precaution}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.extracted_text && (
                <div>
                  <h4>Extracted Text:</h4>
                  <FormattedOutput content={result.extracted_text} />
                </div>
              )}
              
              {result.structured_data && (
                <div>
                  <h4>Structured Analysis:</h4>
                  <FormattedOutput content={result.structured_data} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionDetector;
