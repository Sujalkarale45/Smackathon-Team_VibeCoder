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
    if (!medicines || !Array.isArray(medicines)) return [];
    
    return medicines.map((med, index) => ({
      id: index + 1,
      name: med.name || 'Not specified',
      genericName: med.generic_name || 'Not specified',
      dosage: med.dosage || 'Not specified',
      frequency: med.frequency || 'Not specified',
      timing: med.timing || 'Not specified',
      duration: med.duration || 'Not specified',
      route: med.route || 'Not specified',
      instructions: med.instructions || 'Not specified',
      purpose: med.purpose || 'Not specified'
    }));
  };

  const formatAISuggestions = (suggestions) => {
    if (!suggestions || !Array.isArray(suggestions)) return [];
    
    return suggestions.map((suggestion, index) => ({
      id: index + 1,
      medicine: suggestion.medicine || 'Not specified',
      suggestedTiming: suggestion.suggested_timing || 'Not specified',
      suggestedDuration: suggestion.suggested_duration || 'Not specified',
      suggestedFrequency: suggestion.suggested_frequency || 'Not specified',
      reasoning: suggestion.reasoning || 'Not specified'
    }));
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
              {/* Display the main analysis */}
              {result.analysis && (
                <div className="analysis-section">
                  <div className="analysis-text">
                    <FormattedOutput content={result.analysis} />
                  </div>
                </div>
              )}
              
              {/* Fallback for complex JSON structure (if returned) */}
              {result.prescription_analysis && (
                <>
                  {/* Medicines Section */}
                  {result.prescription_analysis.medicines && result.prescription_analysis.medicines.length > 0 && (
                    <div className="analysis-section">
                      <h4>💊 Medicines Prescribed</h4>
                      <div className="medicines-grid">
                        {formatMedicines(result.prescription_analysis.medicines).map((medicine) => (
                          <div key={medicine.id} className="medicine-card">
                            <div className="medicine-header">
                              <h5>Medicine {medicine.id}: {medicine.name}</h5>
                              {medicine.genericName !== 'Not specified' && (
                                <p className="generic-name">({medicine.genericName})</p>
                              )}
                            </div>
                            
                            <div className="medicine-details">
                              <div className="detail-row">
                                <span className="detail-label">💊 Dosage:</span>
                                <span className="detail-value">{medicine.dosage}</span>
                              </div>
                              
                              <div className="detail-row">
                                <span className="detail-label">🔄 Frequency:</span>
                                <span className="detail-value">{medicine.frequency}</span>
                              </div>
                              
                              <div className="detail-row">
                                <span className="detail-label">⏰ Timing:</span>
                                <span className="detail-value">{medicine.timing}</span>
                              </div>
                              
                              <div className="detail-row">
                                <span className="detail-label">📅 Duration:</span>
                                <span className="detail-value">{medicine.duration}</span>
                              </div>
                              
                              <div className="detail-row">
                                <span className="detail-label">🚀 How to take:</span>
                                <span className="detail-value">{medicine.route}</span>
                              </div>
                              
                              {medicine.instructions !== 'Not specified' && (
                                <div className="detail-row">
                                  <span className="detail-label">📋 Instructions:</span>
                                  <span className="detail-value">{medicine.instructions}</span>
                                </div>
                              )}
                              
                              {medicine.purpose !== 'Not specified' && (
                                <div className="detail-row">
                                  <span className="detail-label">🎯 Purpose:</span>
                                  <span className="detail-value">{medicine.purpose}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Other JSON structure sections remain for backward compatibility */}
                </>
              )}
              
              {/* Raw analysis fallback */}
              {result.raw_analysis && !result.analysis && (
                <div className="analysis-section">
                  <h4>Prescription Analysis</h4>
                  <div className="analysis-text">
                    <FormattedOutput content={result.raw_analysis} />
                  </div>
                </div>
              )}
              
              {/* Error handling */}
              {result.error && (
                <div className="error">
                  <p>{result.error}</p>
                </div>
              )}
              
              {/* Disclaimer */}
              {result.disclaimer && (
                <div className="disclaimer">
                  <p><strong>⚠️ Disclaimer:</strong> {result.disclaimer}</p>
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
