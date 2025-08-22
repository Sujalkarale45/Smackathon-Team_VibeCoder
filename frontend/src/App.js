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

  const renderActiveView = () => {
    switch (activeView) {
      case 'prescription-detector':
        return <PrescriptionDetector onBack={() => setActiveView('dashboard')} />;
      case 'medicine-analyzer':
        return <MedicineAnalyzer onBack={() => setActiveView('dashboard')} />;
      case 'disease-predictor':
        return <DiseasePredictor onBack={() => setActiveView('dashboard')} />;
      case 'diet-planner':
        return <DietPlanner onBack={() => setActiveView('dashboard')} />;
      case 'medical-chatbot':
        return <MedicalChatBot onBack={() => setActiveView('dashboard')} />;
      case 'medical-report-analysis':
        return <MedicalReportAnalysis onBack={() => setActiveView('dashboard')} />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="App">
      {renderActiveView()}
    </div>
  );
}

export default App;
