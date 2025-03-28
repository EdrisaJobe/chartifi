import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { BarChart2, ArrowUpRight, Users, FileUp } from 'lucide-react';
import ImportExcel from './pages/ImportExcel';
import UploadPDF from './pages/UploadPDF';
import CreateChart from './pages/CreateChart';
import DataSources from './pages/DataSources';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

// Demo Banner Component
const DemoBanner = () => (
  <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3 mb-6 text-center">
    <p className="text-indigo-700 dark:text-indigo-300 font-medium">
      Demo purpose site made by Edrisa Jobe
    </p>
  </div>
);

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

  const Dashboard = () => {
    const previewChartRef = useRef<HTMLCanvasElement>(null);
    
    // Create a static chart only once on component mount
    useEffect(() => {
      if (!previewChartRef.current) return;
      
      const ctx = previewChartRef.current.getContext('2d');
      if (!ctx) return;
      
      // Static data for the chart
      const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Performance',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: '#4F46E5',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#4F46E5',
            pointBorderWidth: 2,
            fill: true,
          },
          {
            label: 'Engagement',
            data: [45, 42, 56, 55, 38, 48, 32],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: '#10B981',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#10B981',
            pointBorderWidth: 2,
            fill: true,
          }
        ]
      };
      
      const myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 10,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#111827',
              bodyColor: '#4B5563',
              borderColor: '#E5E7EB',
              borderWidth: 1,
              padding: 10,
              boxPadding: 5
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(160, 174, 192, 0.1)'
              }
            }
          }
        }
      });
      
      // Clean up on unmount
      return () => {
        myChart.destroy();
      };
    }, []);

    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to DataLens</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your powerful data visualization platform. Transform your Excel data into beautiful charts and easily share insights with your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 p-8 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800/30 hover:shadow-md transition-all duration-300">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-lg w-fit mb-4">
              <BarChart2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Create Custom Charts</h3>
            <p className="text-gray-600 dark:text-gray-300">Design interactive bar, line, and pie charts to visualize your data exactly how you want.</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 p-8 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800/30 hover:shadow-md transition-all duration-300">
            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-lg w-fit mb-4">
              <FileUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Import Your Data</h3>
            <p className="text-gray-600 dark:text-gray-300">Easily upload Excel spreadsheets and PDFs to quickly transform your raw data into insights.</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 p-8 rounded-xl shadow-sm border border-amber-100 dark:border-amber-800/30 hover:shadow-md transition-all duration-300">
            <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-lg w-fit mb-4">
              <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Share Insights</h3>
            <p className="text-gray-600 dark:text-gray-300">Download and share your visualizations with your team for better collaborative decision making.</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get Started in Minutes</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                DataLens makes it easy to transform complex data into clear, compelling visualizations. Start by importing your Excel data or creating a custom chart.
              </p>
              <div className="flex gap-4">
                <a href="/import-excel" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Import Excel
                </a>
                <a href="/create-chart" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Create Chart
                </a>
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <canvas ref={previewChartRef} height="240"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <div className="flex flex-1">
          <Sidebar />
          
          <main className={`transition-all duration-300 ease-in-out ml-16 p-8 flex-1`} style={{ marginLeft: sidebarWidth }}>
            <DemoBanner />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/import-excel" element={<ImportExcel />} />
              <Route path="/upload-pdf" element={<UploadPDF />} />
              <Route path="/create-chart" element={<CreateChart />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
