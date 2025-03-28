import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { Upload } from 'lucide-react';
import { importExcelData } from '../api/import-excel';

const ImportExcel = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      setError(null);
      setUploadSuccess(false);
      
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        throw new Error('Please upload an Excel file (.xlsx or .xls)');
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const wb = read(e.target?.result, { type: 'array' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const parsedData = utils.sheet_to_json(ws);
          
          if (!Array.isArray(parsedData) || parsedData.length === 0) {
            throw new Error('No data found in the Excel file');
          }
          
          setData(parsedData);
          
          // Send the data to our API helper
          const response = await importExcelData(parsedData);
          
          if (response.success) {
            setUploadSuccess(true);
          } else {
            throw new Error('Failed to save data');
          }
          
        } catch (error: any) {
          setError(error.message || 'Error processing file. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      reader.readAsArrayBuffer(file);
      
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Import Excel Data
      </h1>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
          id="excel-upload"
          disabled={loading}
        />
        <label
          htmlFor="excel-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {loading ? 'Processing...' : 'Drop your Excel file here or click to browse'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supports .xlsx and .xls files
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
          Excel data imported successfully! ({data.length} rows)
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Imported Data Preview
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {Object.keys(data[0] || {}).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {data.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((cell: any, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                      >
                        {cell?.toString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportExcel;