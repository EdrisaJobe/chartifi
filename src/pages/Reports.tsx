import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Share2, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  ArrowDown,
  ArrowRight,
  Check
} from 'lucide-react';

// Types
interface Report {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'csv' | 'image';
  createdAt: string;
  createdBy: string;
  size: string;
  status: 'scheduled' | 'completed' | 'shared';
  previewUrl?: string;
}

// Mock data
const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    name: 'Q3 Sales Report',
    type: 'pdf',
    createdAt: '2023-10-15T14:30:00Z',
    createdBy: 'John Smith',
    size: '3.2 MB',
    status: 'completed',
    previewUrl: '/reports/q3-sales.pdf'
  },
  {
    id: '2',
    name: 'Monthly Marketing Analytics',
    type: 'excel',
    createdAt: '2023-10-12T09:45:00Z',
    createdBy: 'Jane Doe',
    size: '1.8 MB',
    status: 'shared',
    previewUrl: '/reports/marketing-analytics.xlsx'
  },
  {
    id: '3',
    name: 'Weekly User Activity',
    type: 'csv',
    createdAt: '2023-10-10T16:20:00Z',
    createdBy: 'Mike Johnson',
    size: '0.9 MB',
    status: 'completed',
    previewUrl: '/reports/user-activity.csv'
  },
  {
    id: '4',
    name: 'Product Performance',
    type: 'pdf',
    createdAt: '2023-10-08T11:15:00Z',
    createdBy: 'Sarah Williams',
    size: '4.5 MB',
    status: 'completed',
    previewUrl: '/reports/product-performance.pdf'
  },
  {
    id: '5',
    name: 'Quarterly Financial Summary',
    type: 'excel',
    createdAt: '2023-10-01T15:30:00Z', 
    createdBy: 'Robert Chen',
    size: '2.1 MB',
    status: 'scheduled',
    previewUrl: '/reports/financial-summary.xlsx'
  }
];

const Reports = () => {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('sales');
  const [selectedFrequency, setSelectedFrequency] = useState('once');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedStatus, setSelectedStatus] = useState<'completed' | 'scheduled' | 'shared'>('completed');
  const [reportName, setReportName] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareReport, setShareReport] = useState<Report | null>(null);
  const [shareEmail, setShareEmail] = useState('');

  useEffect(() => {
    // Update report name when template changes
    setReportName(`New ${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Report`);
  }, [selectedTemplate]);

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'medium'
    }).format(date);
  };

  // Get icon for report type
  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'excel':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'csv':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get badge class for status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shared':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Handle delete report
  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(report => report.id !== id));
  };

  // Handle preview report
  const handlePreviewReport = (report: Report) => {
    setPreviewReport(report);
    setShowPreviewModal(true);
  };

  // Handle download report
  const handleDownloadReport = (report: Report) => {
    // In a real application, this would initiate a file download
    // For this demo, we'll just show an alert
    alert(`Downloading ${report.name} (${report.type.toUpperCase()})`);
  };

  // Handle share report
  const handleShareReport = (report: Report) => {
    setShareReport(report);
    setShowShareModal(true);
  };

  // Handle complete share
  const handleCompleteShare = () => {
    if (shareReport && shareEmail) {
      // In a real application, this would send the report to the email
      alert(`Shared ${shareReport.name} with ${shareEmail}`);
      
      // Update report status to shared
      const updatedReports = reports.map(r => 
        r.id === shareReport.id 
          ? { ...r, status: 'shared' as const } 
          : r
      );
      setReports(updatedReports);
      
      // Reset and close modal
      setShareEmail('');
      setShareReport(null);
      setShowShareModal(false);
    }
  };

  // Handle create report
  const handleCreateReport = () => {
    const newReport: Report = {
      id: Date.now().toString(),
      name: reportName,
      type: selectedFormat as 'pdf' | 'excel' | 'csv' | 'image',
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      size: '0.0 MB',
      status: selectedStatus
    };
    
    setReports([newReport, ...reports]);
    setShowCreateModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Reports
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="shared">Shared</option>
                </select>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="image">Image</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getReportTypeIcon(report.type)}
                        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                          {report.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(report.createdAt)}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {report.createdBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 uppercase">
                      {report.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {report.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                          title="Preview"
                          onClick={() => handlePreviewReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                          title="Download"
                          onClick={() => handleDownloadReport(report)}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          title="Share"
                          onClick={() => handleShareReport(report)}
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          title="Delete"
                          onClick={() => handleDeleteReport(report.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Report</h3>
            </div>
            
            <div className="p-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Select Report Template</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedTemplate === 'sales' 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setSelectedTemplate('sales')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    {selectedTemplate === 'sales' && (
                      <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <h5 className="font-medium text-gray-900 dark:text-white">Sales Report</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Summary of sales performance and metrics</p>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedTemplate === 'analytics' 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setSelectedTemplate('analytics')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    {selectedTemplate === 'analytics' && (
                      <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <h5 className="font-medium text-gray-900 dark:text-white">Analytics Report</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">User activity and engagement metrics</p>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedTemplate === 'financial' 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setSelectedTemplate('financial')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    {selectedTemplate === 'financial' && (
                      <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <h5 className="font-medium text-gray-900 dark:text-white">Financial Report</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Revenue, expenses and financial metrics</p>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedTemplate === 'custom' 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setSelectedTemplate('custom')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    {selectedTemplate === 'custom' && (
                      <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <h5 className="font-medium text-gray-900 dark:text-white">Custom Report</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Build a custom report from scratch</p>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Report Settings</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Report Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter report name"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Format
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as 'completed' | 'scheduled' | 'shared')}
                  >
                    <option value="completed">Completed</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Frequency
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      className={`py-2 text-center text-sm border rounded-md ${
                        selectedFrequency === 'once' 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onClick={() => setSelectedFrequency('once')}
                    >
                      Once
                    </button>
                    <button
                      type="button"
                      className={`py-2 text-center text-sm border rounded-md ${
                        selectedFrequency === 'daily' 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onClick={() => setSelectedFrequency('daily')}
                    >
                      Daily
                    </button>
                    <button
                      type="button"
                      className={`py-2 text-center text-sm border rounded-md ${
                        selectedFrequency === 'weekly' 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onClick={() => setSelectedFrequency('weekly')}
                    >
                      Weekly
                    </button>
                    <button
                      type="button"
                      className={`py-2 text-center text-sm border rounded-md ${
                        selectedFrequency === 'monthly' 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onClick={() => setSelectedFrequency('monthly')}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
                
                {selectedFrequency !== 'once' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReport}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <span>Generate Report</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 h-3/4 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview: {previewReport.name}</h3>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-auto">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {previewReport.type.toUpperCase()} file preview would be shown here
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    File size: {previewReport.size}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(previewReport.status)}`}>
                  {previewReport.status}
                </span>
                <span className="ml-2 text-sm text-gray-500">Created on {formatDate(previewReport.createdAt)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleDownloadReport(previewReport);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleShareReport(previewReport);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && shareReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share Report</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                {getReportTypeIcon(shareReport.type)}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{shareReport.name}</h4>
                  <p className="text-sm text-gray-500">{shareReport.type.toUpperCase()} • {shareReport.size}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Share with Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter email address"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Permission
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="view"
                  >
                    <option value="view">Can view</option>
                    <option value="comment">Can comment</option>
                    <option value="edit">Can edit</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message (optional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Add a message..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteShare}
                disabled={!shareEmail}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center ${!shareEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>Share</span>
                <Share2 className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports; 