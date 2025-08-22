import React, { useState } from 'react';
import axios from 'axios';
import FormattedOutput from './FormattedOutput';

const MedicalChatBot = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m your AI medical assistant. I can help answer general health questions and provide health information. Please note that I\'m not a replacement for professional medical advice. How can I help you today?'
    }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentQuestion.trim()) {
      return;
    }

    const userMessage = {
      type: 'user',
      content: currentQuestion
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setCurrentQuestion('');

    try {
      // Prepare chat history for context
      const chatHistory = messages.map(msg => ({
        user: msg.type === 'user' ? msg.content : '',
        bot: msg.type === 'bot' ? msg.content : ''
      }));

      const response = await axios.post('/api/medical-chatbot', {
        question: currentQuestion,
        chat_history: chatHistory
      });

      const botMessage = {
        type: 'bot',
        content: response.data.response
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        type: 'bot',
        content: 'I apologize, but I encountered an error while processing your question. Please try again or consult with a healthcare professional for medical concerns.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const downloadChatHistory = () => {
    const chatContent = messages.map(msg => 
      `${msg.type === 'user' ? 'You' : 'MedAI Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    const content = `Medical Chat History\n\n${chatContent}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medical-chat-history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    setMessages([
      {
        type: 'bot',
        content: 'Hello! I\'m your AI medical assistant. I can help answer general health questions and provide health information. Please note that I\'m not a replacement for professional medical advice. How can I help you today?'
      }
    ]);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2>Medical ChatBot</h2>
      </div>
      
      <div className="tool-content">
        <div className="chat-container">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.type}`}>
              <strong>{message.type === 'user' ? 'You' : 'MedAI Assistant'}:</strong>
              <div style={{ marginTop: '0.5rem' }}>
                {message.type === 'bot' ? (
                  <FormattedOutput content={message.content} />
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="chat-message bot">
              <strong>MedAI Assistant:</strong>
              <div style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                Typing...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="chat-input-container">
            <input
              type="text"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Ask a health-related question..."
              className="chat-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="primary-button"
              disabled={loading || !currentQuestion.trim()}
            >
              Send
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="secondary-button" onClick={downloadChatHistory}>
            Download Chat History
          </button>
          <button className="secondary-button" onClick={clearChat}>
            Clear Chat
          </button>
        </div>

        <div style={{ 
          background: '#fff3e0', 
          border: '1px solid #ff9800', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginTop: '1rem',
          color: '#e65100',
          fontSize: '0.9rem'
        }}>
          <strong>Important:</strong> This chatbot provides general health information only. For medical emergencies, contact emergency services immediately. For specific medical concerns, please consult with qualified healthcare professionals.
        </div>
      </div>
    </div>
  );
};

export default MedicalChatBot;
