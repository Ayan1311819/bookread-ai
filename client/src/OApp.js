import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

function HomePage() {
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      const filename = file.name;
      navigate(`/${filename}`, {
        state: {
          fileUrl: `http://localhost:5000${data.filePath}`,
          originalName: filename,
          uploadedFilename: data.filePath.split('/').pop(),
        },
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="home-container">
      <h1>📚 BookRead AI</h1>
      <p>Upload a PDF to start reading and asking AI questions</p>
      <input type="file" accept=".pdf" onChange={handleFileUpload} className="upload-input" />
    </div>
  );
}

function PDFViewerPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedText, setSelectedText] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fileUrl = location.state?.fileUrl;
  const originalName = location.state?.originalName;

  if (!fileUrl) {
    return (
      <div className="no-file">
        <p>No PDF file found. Please upload a file first.</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  const toggleTheme = () => {
    document.body.classList.toggle('dark');
    setIsDarkMode((prev) => !prev);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleTextSelection = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      const selected = selection.toString().trim();

      if (selected.length > 0) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 + window.scrollY });
          setShowTooltip(true);
        } catch {
          setShowTooltip(false);
        }
      } else {
        setShowTooltip(false);
      }
    }, 100);
  };

  const handleCopy = () => {
    const selection = window.getSelection();
    navigator.clipboard.writeText(selection.toString());
    setShowTooltip(false);
  };

  const handleAskAI = () => {
    const selection = window.getSelection();
    setSelectedText(selection.toString());
    setShowTooltip(false);
    setTimeout(() => {
      const input = document.querySelector('.ai-query-input');
      if (input) input.focus();
    }, 100);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.selection-tooltip')) setShowTooltip(false);
  };

  const queryAI = async () => {
    if (!selectedText || !aiQuery) {
      alert('Please select text and enter a query');
      return;
    }

    setIsLoading(true);
    setAiResponse('');

    try {
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedText,
          prompt: aiQuery,
          filename: location.state.uploadedFilename,
          filePath: new URL(fileUrl).pathname,
          pageNumber: pageNumber,
        }),
      });

      const data = await response.json();
      setAiResponse(data.response);
    } catch (error) {
      console.error('AI query failed:', error);
      setAiResponse('❌ Error: Failed to query AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="viewer-container" onClick={handleClickOutside}>
      <div className="viewer-header">
        <h2>📖 {originalName}</h2>
        <div>
          <button onClick={toggleTheme} className="toggle-theme-btn">
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>← Upload New PDF</button>
        </div>
      </div>

      {showTooltip && (
        <div className="selection-tooltip" style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>
          <button onClick={handleCopy}>📋 Copy</button>
          <button onClick={handleAskAI}>🤖 Ask AI</button>
        </div>
      )}

      <div className="viewer-row">
        <div className="pdf-viewer">
          <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <div onMouseUp={handleTextSelection} onTouchEnd={handleTextSelection}>
              <Page
                pageNumber={pageNumber}
                scale={1.5}
                renderAnnotationLayer={false}
                renderTextLayer={true}
              />
            </div>
          </Document>

          {numPages && (
            <div className="page-controls">
              <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>Previous</button>
              <span>Page {pageNumber} of {numPages}</span>
              <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>Next</button>
            </div>
          )}
        </div>

        <div className="ai-panel">
          <h3>🤖 Ask AI</h3>

          {selectedText && (
            <div className="selected-text-box sci-fi">
              <div className="label">📌 Selected Text</div>
              <div className="selected-content">{selectedText}</div>
            </div>
          )}

          <input
            type="text"
            className="ai-query-input"
            placeholder="Ask a question about the selected text..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
          />

          <button onClick={queryAI} disabled={!selectedText || !aiQuery}>
            {isLoading ? '🤖 Thinking...' : 'Ask AI'}
          </button>

          {isLoading && <div className="ai-loading">⌛ Analyzing... please wait</div>}

          {aiResponse && !isLoading && (
            <div className="ai-response sci-fi">
              <div className="label">🧠 AI Response</div>
              <div className="response-body">{aiResponse}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:filename" element={<PDFViewerPage />} />
      </Routes>
    </Router>
  );
}

export default App;