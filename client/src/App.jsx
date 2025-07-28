import React, { useState } from 'react';
import HomePage from './components/HomePage.jsx';
import PDFViewer from './components/PDFViewer.jsx';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [fileData, setFileData] = useState(null);

  const handleFileUpload = (uploadedFileData) => {
    setFileData(uploadedFileData);
    setCurrentView('viewer');
  };

  const handleGoHome = () => {
    setCurrentView('home');
    setFileData(null);
  };

  return (
    <div className="App">
      {currentView === 'home' ? (
        <HomePage onFileUpload={handleFileUpload} />
      ) : (
        <PDFViewer fileData={fileData} onGoHome={handleGoHome} />
      )}
    </div>
  );
}
export default App;