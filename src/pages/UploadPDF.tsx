import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadPDF } from '../api/upload-pdf';

const UploadPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      setError(null);
      setPreview(null);
      setUploadSuccess(false);
      
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.name.match(/\.pdf$/i)) {
        throw new Error('Please upload a PDF file');
      }

      setFile(file);
      
      // Create a preview URL for the PDF
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
      
      // Use our API helper
      const response = await uploadPDF(file);
      
      if (response.success) {
        setUploadSuccess(true);
      } else {
        throw new Error('Failed to upload PDF');
      }
      
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Upload PDF Document
      </h1>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="pdf-upload"
          disabled={loading}
        />
        <label
          htmlFor="pdf-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {loading ? 'Processing...' : 'Drop your PDF file here or click to browse'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supports PDF files only
          </p>
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {uploadSuccess && !error && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg">
          PDF uploaded successfully!
        </div>
      )}

      {preview && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            PDF Preview
          </h2>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <iframe 
              src={preview} 
              className="w-full h-[600px]" 
              title="PDF Preview"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {file?.name} ({Math.round(file?.size ? file.size / 1024 : 0)} KB)
            </p>
            <button 
              onClick={() => window.open(preview, '_blank')}
              className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPDF; 