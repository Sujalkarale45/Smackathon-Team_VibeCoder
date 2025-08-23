import React from 'react';

const Dashboard = ({ onNavigate, language, onLanguageChange }) => {
  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'hindi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'marathi', name: 'मराठी (Marathi)', flag: '🇮🇳' }
  ];

  const tools = [
    {
      id: 'prescription-detector',
      title: 'Prescription Detector',
      description: 'Upload prescription images to extract medicine details, dosages, and timings using AI vision technology.',
      icon: '💊'
    },
    {
      id: 'medicine-analyzer',
      title: 'Medicine Analyzer',
      description: 'Analyze medicines by name or image to get information about uses, side effects, and alternatives.',
      icon: '🔍'
    },
    {
      id: 'disease-predictor',
      title: 'Disease Predictor',
      description: 'Input symptoms to get AI-powered predictions of possible conditions and recommendations.',
      icon: '🩺'
    },
    {
      id: 'diet-planner',
      title: 'Diet Planner',
      description: 'Generate personalized diet plans based on medical conditions or current medications.',
      icon: '🥗'
    },
    {
      id: 'medical-chatbot',
      title: 'Medical ChatBot',
      description: 'Ask general health questions and get informative responses from our AI medical assistant.',
      icon: '💬'
    },
    {
      id: 'medical-report-analysis',
      title: 'Medical Report Analysis',
      description: 'Upload medical reports to get AI-powered analysis of key findings and interpretations.',
      icon: '📋'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Med-Chat</h1>
        <div className="language-selector">
          <label htmlFor="language-select">🌐 Language:</label>
          <select 
            id="language-select"
            value={language} 
            onChange={(e) => onLanguageChange(e.target.value)}
            className="language-dropdown"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="tools-grid">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className="tool-card"
            onClick={() => onNavigate(tool.id)}
          >
            <span className="icon">{tool.icon}</span>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
