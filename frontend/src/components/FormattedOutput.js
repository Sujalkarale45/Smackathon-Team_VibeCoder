import React from 'react';

const FormattedOutput = ({ content, title }) => {
  const formatContent = (text) => {
    if (!text) return '';
    
    // Split by lines for processing
    const lines = text.split('\n');
    const formattedLines = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        formattedLines.push(<br key={index} />);
        return;
      }
      
      // Check if line is a header (starts with number or has :)
      if (trimmedLine.match(/^\d+\./) || trimmedLine.includes(':')) {
        formattedLines.push(
          <div key={index} className="formatted-header">
            {trimmedLine}
          </div>
        );
      } 
      // Check if line starts with - (bullet point)
      else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        formattedLines.push(
          <div key={index} className="formatted-bullet">
            {trimmedLine}
          </div>
        );
      }
      // Check if line contains warning symbols
      else if (trimmedLine.includes('⚠️') || trimmedLine.includes('🚨') || trimmedLine.includes('📋')) {
        formattedLines.push(
          <div key={index} className="formatted-warning">
            {trimmedLine}
          </div>
        );
      }
      // Regular text
      else {
        formattedLines.push(
          <div key={index} className="formatted-text">
            {trimmedLine}
          </div>
        );
      }
    });
    
    return formattedLines;
  };

  return (
    <div className="formatted-output">
      {title && <h4 className="output-title">{title}</h4>}
      <div className="output-content">
        {formatContent(content)}
      </div>
    </div>
  );
};

export default FormattedOutput;
