import React, { useState } from 'react';

function HomePage({ onFileUpload }) {
  const [isUploading, setIsUploading] = useState(false);
 
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://13.232.81.182:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      // Pass file info to parent component
      onFileUpload({
        fileUrl: `http://13.232.81.182:5000${data.filePath}`,
        originalName: file.name,
        uploadedFilename: data.filePath.split('/').pop(),
      });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">📚 BookRead AI</h1>
        <p className="text-gray-600 mb-8">Upload a PDF to start reading and asking AI questions</p>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileUpload}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        {isUploading && (
          <p className="mt-4 text-blue-600">📤 Uploading file...</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;