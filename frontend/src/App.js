import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import PrescriptionDetector from './components/PrescriptionDetector';
import MedicineAnalyzer from './components/MedicineAnalyzer';
import DiseasePredictor from './components/DiseasePredictor';
import DietPlanner from './components/DietPlanner';
import MedicalChatBot from './components/MedicalChatBot';
import MedicalReportAnalysis from './components/MedicalReportAnalysis';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const renderActiveView = () => {
    switch (activeView) {
      case 'prescription-detector':
        return <PrescriptionDetector onBack={() => setActiveView('dashboard')} language={selectedLanguage} />;
      case 'medicine-analyzer':
        return <MedicineAnalyzer onBack={() => setActiveView('dashboard')} language={selectedLanguage} />;
      case 'disease-predictor':
        return <DiseasePredictor onBack={() => setActiveView('dashboard')} language={selectedLanguage} />;
      case 'diet-planner':
        return <DietPlanner onBack={() => setActiveView('dashboard')} language={selectedLanguage} />;
      case 'medical-chatbot':
        return <MedicalChatBot onBack={() => setActiveView('dashboard')} language={selectedLanguage} />;
      case 'medical-report-analysis':
        return <MedicalReportAnalysis onBack={() => setActiveView('dashboard')} language={selectedLanguage} />;
      default:
        return <Dashboard onNavigate={setActiveView} language={selectedLanguage} onLanguageChange={setSelectedLanguage} />;
    }
  };

  return (
    <div className="App">
      {renderActiveView()}
    </div>
  );
}

export default App;
