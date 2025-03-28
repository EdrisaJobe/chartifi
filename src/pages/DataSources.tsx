import React, { useState } from 'react';
import { Database, Plus, Trash2, Edit, ExternalLink, Search, Filter, FileText, Cloud } from 'lucide-react';

// Interface for datasource objects
interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'cloud';
  status: 'active' | 'disconnected' | 'pending';
  lastSync: string;
  createdAt: string;
  url?: string;
}

// Mock data for datasources
const MOCK_DATASOURCES: DataSource[] = [
  {
    id: '1',
    name: 'Sales Database',
    type: 'database',
    status: 'active',
    lastSync: '2023-08-12T15:30:00Z',
    createdAt: '2023-06-10T08:45:00Z',
    url: 'mysql://sales.internal:3306/sales'
  },
  {
    id: '2',
    name: 'Marketing API',
    type: 'api',
    status: 'active',
    lastSync: '2023-08-14T12:15:00Z',
    createdAt: '2023-05-22T14:30:00Z',
    url: 'https://api.marketing.company/v2'
  },
  {
    id: '3',
    name: 'Legacy Reports',
    type: 'file',
    status: 'disconnected',
    lastSync: '2023-07-30T10:45:00Z',
    createdAt: '2023-04-15T09:20:00Z'
  },
  {
    id: '4',
    name: 'Cloud Storage',
    type: 'cloud',
    status: 'active',
    lastSync: '2023-08-15T08:00:00Z',
    createdAt: '2023-07-01T11:10:00Z',
    url: 's3://data-warehouse/exports'
  },
  {
    id: '5',
    name: 'Product Metrics',
    type: 'api',
    status: 'pending',
    lastSync: '2023-08-10T16:20:00Z',
    createdAt: '2023-08-01T13:45:00Z',
    url: 'https://metrics.internal/v1/products'
  }
];

const DataSources = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>(MOCK_DATASOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDataSource, setCurrentDataSource] = useState<Partial<DataSource>>({
    name: '',
    type: 'database',
    status: 'pending',
    url: ''
  });

  // Filter data sources based on search and filters
  const filteredDataSources = dataSources.filter(ds => {
    const matchesSearch = ds.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (ds.url && ds.url.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || ds.status === statusFilter;
    const matchesType = typeFilter === 'all' || ds.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(date);
  };

  // Get status badge class based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'disconnected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Get type icon based on type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'api':
        return <ExternalLink className="h-4 w-4" />;
      case 'file':
        return <FileText className="h-4 w-4" />;
      case 'cloud':
        return <Cloud className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  // Handle adding a new data source
  const handleAddDataSource = () => {
    if (!currentDataSource.name) return;
    
    const now = new Date().toISOString();
    
    if (isEditing && currentDataSource.id) {
      // Update existing data source
      setDataSources(dataSources.map(ds => 
        ds.id === currentDataSource.id 
          ? { ...ds, ...currentDataSource as DataSource } 
          : ds
      ));
    } else {
      // Add new data source
      const newDs: DataSource = {
        id: Date.now().toString(),
        name: currentDataSource.name,
        type: (currentDataSource.type as 'database' | 'api' | 'file' | 'cloud') || 'database',
        status: (currentDataSource.status as 'active' | 'disconnected' | 'pending') || 'pending',
        lastSync: now,
        createdAt: now,
        url: currentDataSource.url
      };
      
      setDataSources([...dataSources, newDs]);
    }
    
    // Reset form and close modal
    resetFormAndCloseModal();
  };

  // Handle editing a data source
  const handleEditDataSource = (source: DataSource) => {
    setIsEditing(true);
    setCurrentDataSource({ ...source });
    setShowModal(true);
  };

  // Handle deleting a data source
  const handleDeleteDataSource = (id: string) => {
    setDataSources(dataSources.filter(ds => ds.id !== id));
  };
  
  // Reset form and close modal
  const resetFormAndCloseModal = () => {
    setCurrentDataSource({ 
      name: '', 
      type: 'database', 
      status: 'pending',
      url: '' 
    });
    setIsEditing(false);
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Data Sources
        </h1>
        <button
          onClick={() => {
            setIsEditing(false);
            setCurrentDataSource({ 
              name: '', 
              type: 'database', 
              status: 'pending',
              url: '' 
            });
            setShowModal(true);
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Data Source
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
                placeholder="Search data sources..."
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
                  <option value="active">Active</option>
                  <option value="disconnected">Disconnected</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Database className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="database">Database</option>
                  <option value="api">API</option>
                  <option value="file">File</option>
                  <option value="cloud">Cloud</option>
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Synced
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDataSources.length > 0 ? (
                filteredDataSources.map((source) => (
                  <tr key={source.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {source.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="flex-shrink-0 h-7 w-7 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-2">
                          {getTypeIcon(source.type)}
                        </span>
                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {source.type}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(source.status)}`}>
                        {source.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(source.lastSync)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(source.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                          onClick={() => handleEditDataSource(source)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          onClick={() => handleDeleteDataSource(source.id)}
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
                    No data sources found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Source Modal (Add/Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Data Source' : 'Add Data Source'}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={currentDataSource.name}
                    onChange={(e) => setCurrentDataSource({...currentDataSource, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter data source name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={currentDataSource.type}
                    onChange={(e) => setCurrentDataSource({...currentDataSource, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="database">Database</option>
                    <option value="api">API</option>
                    <option value="file">File</option>
                    <option value="cloud">Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={currentDataSource.status}
                    onChange={(e) => setCurrentDataSource({...currentDataSource, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="disconnected">Disconnected</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Connection URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={currentDataSource.url || ''}
                    onChange={(e) => setCurrentDataSource({...currentDataSource, url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter connection URL"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
              <button
                onClick={resetFormAndCloseModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDataSource}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!currentDataSource.name}
              >
                {isEditing ? 'Save Changes' : 'Add Data Source'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSources; 