import React, { useState } from 'react';
import axios from 'axios';
import FormattedOutput from './FormattedOutput';

const DietPlanner = ({ onBack, language }) => {
  const [condition, setCondition] = useState('');
  const [medicines, setMedicines] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!condition.trim() && !medicines.trim()) {
      setError('Please provide either a medical condition or current medicines');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/diet-planner', {
        condition: condition,
        medicines: medicines,
        dietary_restrictions: dietaryRestrictions,
        language: language || 'en'
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while creating the diet plan');
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const content = `Personalized Diet Plan\n\nCondition: ${condition}\nMedicines: ${medicines}\nDietary Restrictions: ${dietaryRestrictions}\n\nDiet Plan:\n${result.diet_plan}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diet-plan.txt';
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
        <h2>Diet Planner</h2>
      </div>
      
      <div className="tool-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Medical Condition</label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g., Diabetes, Hypertension, High Cholesterol"
            />
          </div>

          <div className="form-group">
            <label>Current Medicines</label>
            <textarea
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              placeholder="List any medicines you're currently taking"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Dietary Restrictions (Optional)</label>
            <textarea
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
              placeholder="e.g., Vegetarian, Vegan, Gluten-free, Food allergies"
              rows="3"
            />
          </div>
          
          <button 
            type="submit" 
            className="primary-button"
            disabled={loading}
          >
            {loading ? 'Creating Diet Plan...' : 'Generate Diet Plan'}
          </button>
        </form>

        {loading && (
          <div className="loading">
            Creating personalized diet plan with AI...
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
              <h3>Your Personalized Diet Plan</h3>
              <button className="secondary-button" onClick={downloadResult}>
                Download Diet Plan
              </button>
            </div>
            
            <div className="results-content">
              <FormattedOutput 
                content={result.diet_plan} 
                title="Your Personalized Diet Plan" 
              />
            </div>
            
            <div style={{ 
              background: '#e8f5e8', 
              border: '1px solid #4caf50', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginTop: '1rem',
              color: '#2e7d32'
            }}>
              <strong>Note:</strong> This diet plan is generated based on general guidelines. Individual nutritional needs may vary. Please consult with a nutritionist or healthcare provider for personalized dietary advice, especially if you have specific medical conditions.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietPlanner;
