import React, { useState } from 'react';
import axios from 'axios';
import FormattedOutput from './FormattedOutput';

const DiseasePredictor = ({ onBack, language }) => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!symptoms.trim()) {
      setError('Please enter your symptoms');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/disease-predictor', {
        symptoms: symptoms,
        language: language || 'en'
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while predicting conditions');
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const content = `Disease Prediction Report\n\nSymptoms: ${symptoms}\n\nPrediction:\n${result.prediction}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'disease-prediction.txt';
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
        <h2>Disease Predictor</h2>
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
          <strong>⚠️ Medical Disclaimer:</strong> This tool provides general information for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Describe Your Symptoms</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Please describe your symptoms in detail (e.g., headache for 2 days, fever, nausea, fatigue)"
              rows="6"
              required
            />
            <small style={{ color: '#666', fontSize: '0.9rem' }}>
              Be as specific as possible about duration, severity, and any associated symptoms
            </small>
          </div>
          
          <button 
            type="submit" 
            className="primary-button"
            disabled={loading}
          >
            {loading ? 'Analyzing Symptoms...' : 'Predict Conditions'}
          </button>
        </form>

        {loading && (
          <div className="loading">
            Analyzing symptoms with AI...
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
              <h3>Condition Predictions</h3>
              <button className="secondary-button" onClick={downloadResult}>
                Download Results
              </button>
            </div>
            
            <div className="results-content">
              <FormattedOutput 
                content={result.prediction} 
                title="Condition Predictions" 
              />
            </div>
            
            <div style={{ 
              background: '#e3f2fd', 
              border: '1px solid #2196f3', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginTop: '1rem',
              color: '#1565c0'
            }}>
              <strong>Important:</strong> These predictions are based on AI analysis and should not replace professional medical consultation. If you have serious concerns about your health, please contact a healthcare provider immediately.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseasePredictor;
