import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use CDN - most reliable approach
// Use matching version from the same source
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'; 

function PDFViewer({ fileData, onGoHome }) {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', content: '👋 Hi! Select some text from the PDF and ask me anything about it.' }
  ]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pdfError, setPdfError] = useState(null);

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  // Handle PDF load error
  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
    setPdfError('Failed to load PDF. Please try uploading again.');
  };

  // Handle text selection
  const handleTextSelection = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      const selected = selection.toString().trim();

      if (selected.length > 0) {
        setSelectedText(selected);
        
        // Get selection position for tooltip
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setTooltipPosition({ 
            x: rect.left + rect.width / 2, 
            y: rect.top - 10 + window.scrollY 
          });
          setShowTooltip(true);
        } catch {
          setShowTooltip(false);
        }
      } else {
        setShowTooltip(false);
        setSelectedText('');
      }
    }, 100);
  };

  // Handle copy functionality
  const handleCopy = () => {
    navigator.clipboard.writeText(selectedText);
    setShowTooltip(false);
    // Clear selection
    window.getSelection().removeAllRanges();
  };

  // Handle Ask AI with Gemini API
  const handleAskAI = () => {
    setIsCopilotOpen(true);
    setShowTooltip(false);
  };

  // Send query to AI
  const sendAIQuery = async () => {
    if (!selectedText || !currentQuery.trim()) {
      alert('Please select text and enter a question');
      return;
    }

    // Add user message to chat
    const userMessage = { type: 'user', content: currentQuery };
    setChatMessages(prev => [...prev, userMessage]);
    
    setIsAILoading(true);
    setCurrentQuery('');

    try {
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedText,
          prompt: currentQuery,
          filename: fileData?.uploadedFilename || 'document.pdf'
        }),
      });

      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage = { type: 'ai', content: data.response };
      setChatMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('AI query failed:', error);
      const errorMessage = { type: 'ai', content: '❌ Sorry, I encountered an error. Please try again.' };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAILoading(false);
    }
  };

  // Handle Enter key in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendAIQuery();
    }
  };

  // Close tooltip when clicking elsewhere
  const handleClickOutside = (e) => {
    if (!e.target.closest('.selection-tooltip')) {
      setShowTooltip(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100" onClick={handleClickOutside}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">📖 {fileData?.originalName || 'Document.pdf'}</h2>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md">
            🌙 Dark Mode
          </button>
          <button 
            onClick={onGoHome}
            className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded-md text-blue-700"
          >
            ← Upload New
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        {/* PDF Viewer Area */}
        <div className={`flex-1 transition-all duration-300 ${isCopilotOpen ? 'mr-96' : ''}`}>
          <div className="h-full overflow-y-auto bg-gray-200 p-4">
            {/* Real PDF Rendering */}
            <div className="max-w-4xl mx-auto" onMouseUp={handleTextSelection}>
              {pdfError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p>{pdfError}</p>
                  <button 
                    onClick={onGoHome}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Upload New PDF
                  </button>
                </div>
              ) : fileData?.fileUrl ? (
                <Document
                  file={fileData.fileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="text-center py-12">
                      <p className="text-gray-600">📄 Loading PDF...</p>
                    </div>
                  }
                >
                  {numPages && Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="mb-4">
                      <Page
                        pageNumber={index + 1}
                        scale={1.2}
                        renderAnnotationLayer={false}
                        renderTextLayer={true}
                        className="shadow-lg rounded-lg overflow-hidden bg-white mx-auto"
                        loading={
                          <div className="bg-white shadow-lg rounded-lg p-8 min-h-96 flex items-center justify-center">
                            <p className="text-gray-500">Loading page {index + 1}...</p>
                          </div>
                        }
                      />
                    </div>
                  ))}
                </Document>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No PDF file loaded</p>
                  <button 
                    onClick={onGoHome}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Upload PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Copilot Sidebar */}
        <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ${
          isCopilotOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="h-full flex flex-col">
            {/* Copilot Header */}
            <div className="p-4 border-b bg-blue-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">🤖 AI Copilot</h3>
                <button 
                  onClick={() => setIsCopilotOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Selected Text Display */}
            {selectedText && (
              <div className="p-4 bg-blue-50 border-b">
                <p className="text-sm text-gray-600 mb-2">Selected Text:</p>
                <div className="bg-white p-3 rounded border text-sm">
                  {selectedText}
                </div>
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`${
                    message.type === 'user' 
                      ? 'bg-blue-100 ml-4 text-right' 
                      : 'bg-gray-100 mr-4'
                  } p-3 rounded-lg`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
                
                {isAILoading && (
                  <div className="bg-gray-100 mr-4 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">🤖 Thinking...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask about the selected text..."
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!selectedText || isAILoading}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <button 
                  onClick={sendAIQuery}
                  disabled={!selectedText || !currentQuery.trim() || isAILoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isAILoading ? '...' : 'Ask'}
                </button>
              </div>
              {!selectedText && (
                <p className="text-xs text-gray-500 mt-1">Select text from the PDF first</p>
              )}
            </div>
          </div>
        </div>

        {/* Selection Tooltip - positioned at selection */}
        {showTooltip && (
          <div 
            className="selection-tooltip fixed bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg z-50 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: tooltipPosition.x, 
              top: tooltipPosition.y
            }}
          >
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className="text-xs px-2 py-1 bg-gray-600 rounded hover:bg-gray-500"
              >
                📋 Copy
              </button>
              <button 
                onClick={handleAskAI}
                className="text-xs px-2 py-1 bg-blue-600 rounded hover:bg-blue-500"
              >
                🤖 Ask AI
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default PDFViewer;