import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { BarChart2, ArrowUpRight, Users } from 'lucide-react';
import ImportExcel from './pages/ImportExcel';

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(64); // Default collapsed width (16 * 4 = 64px)

  // Listen for hover events from sidebar
  useEffect(() => {
    const handleSidebarExpand = () => setSidebarWidth(256); // 64 * 4 = 256px
    const handleSidebarCollapse = () => setSidebarWidth(64); // 16 * 4 = 64px

    window.addEventListener('sidebar-expand', handleSidebarExpand);
    window.addEventListener('sidebar-collapse', handleSidebarCollapse);

    return () => {
      window.removeEventListener('sidebar-expand', handleSidebarExpand);
      window.removeEventListener('sidebar-collapse', handleSidebarCollapse);
    };
  }, []);

  const Dashboard = () => (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <BarChart2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-green-600 dark:text-green-400 flex items-center text-sm font-medium">
              +12.5%
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Analytics</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">2,543</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-green-600 dark:text-green-400 flex items-center text-sm font-medium">
              +8.2%
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Users</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,420</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BarChart2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-green-600 dark:text-green-400 flex items-center text-sm font-medium">
              +23.1%
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Data Points</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">8.2M</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Analytics</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Analytics visualization will be implemented here</p>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <div className="flex flex-1">
          <Sidebar />
          
          <main className={`transition-all duration-300 ease-in-out ml-16 p-8 flex-1`} style={{ marginLeft: sidebarWidth }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/import-excel" element={<ImportExcel />} />
            </Routes>
          </main>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
