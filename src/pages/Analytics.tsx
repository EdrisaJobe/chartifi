import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart2, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  Filter
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

// Sample data for analytics
const SAMPLE_DATA = {
  weeklyUsers: [1250, 1407, 1390, 1502, 1608, 1724, 1850],
  conversionRates: [3.2, 3.5, 3.7, 3.1, 3.9, 4.2, 4.5],
  revenue: [12500, 13200, 11800, 14500, 15800, 16200, 17800],
  sourceDistribution: {
    'Organic Search': 35,
    'Direct': 25,
    'Referral': 20,
    'Social': 15,
    'Email': 5
  },
  deviceDistribution: {
    'Desktop': 58,
    'Mobile': 35,
    'Tablet': 7
  }
};

const Analytics = () => {
  const [dateRange, setDateRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('users');
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const barChartInstance = useRef<Chart | null>(null);
  const pieChartInstance = useRef<Chart | null>(null);
  const lineChartInstance = useRef<Chart | null>(null);

  // Calculate percentage changes for KPIs
  const userChange = +5.2;
  const conversionChange = +0.8;
  const revenueChange = +8.5;
  
  useEffect(() => {
    // Render bar chart
    if (barChartRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      
      const ctx = barChartRef.current.getContext('2d');
      if (ctx) {
        barChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Active Users',
              data: SAMPLE_DATA.weeklyUsers,
              backgroundColor: 'rgba(79, 70, 229, 0.8)',
              borderColor: 'rgba(79, 70, 229, 1)',
              borderWidth: 1,
              borderRadius: 4,
              barThickness: 16
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'Daily Active Users',
                font: {
                  size: 16,
                  weight: 'bold'
                },
                padding: {
                  top: 10,
                  bottom: 20
                }
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
      }
    }
    
    // Render pie chart
    if (pieChartRef.current) {
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
      
      const ctx = pieChartRef.current.getContext('2d');
      if (ctx) {
        const data = SAMPLE_DATA.sourceDistribution;
        pieChartInstance.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: Object.keys(data),
            datasets: [{
              data: Object.values(data),
              backgroundColor: [
                'rgba(79, 70, 229, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(139, 92, 246, 0.8)'
              ],
              borderColor: '#ffffff',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  boxWidth: 12,
                  padding: 15
                }
              },
              title: {
                display: true,
                text: 'Traffic Sources',
                font: {
                  size: 16,
                  weight: 'bold'
                },
                padding: {
                  top: 10,
                  bottom: 20
                }
              }
            }
          }
        });
      }
    }
    
    // Render line chart
    if (lineChartRef.current) {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
      
      const ctx = lineChartRef.current.getContext('2d');
      if (ctx) {
        lineChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Conversion Rate (%)',
              data: SAMPLE_DATA.conversionRates,
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              borderColor: 'rgba(16, 185, 129, 1)',
              borderWidth: 2,
              tension: 0.4,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: 'rgba(16, 185, 129, 1)',
              pointRadius: 4,
              pointBorderWidth: 2,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'Conversion Trends',
                font: {
                  size: 16,
                  weight: 'bold'
                },
                padding: {
                  top: 10,
                  bottom: 20
                }
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
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
    };
  }, [dateRange, selectedMetric]);
  
  // Render percentage change with appropriate arrow
  const renderChange = (value: number) => {
    const isPositive = value >= 0;
    const color = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    const Arrow = isPositive ? ArrowUp : ArrowDown;
    
    return (
      <span className={`flex items-center text-sm font-medium ${color}`}>
        {isPositive ? '+' : ''}{value}%
        <Arrow className="h-4 w-4 ml-1" />
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Analytics Dashboard</h1>
      
      {/* Controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              dateRange === 'week' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600'
            }`}
            onClick={() => setDateRange('week')}
          >
            Last Week
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              dateRange === 'month' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600'
            }`}
            onClick={() => setDateRange('month')}
          >
            Last Month
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              dateRange === 'year' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600'
            }`}
            onClick={() => setDateRange('year')}
          >
            Last Year
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              className="pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="users">Users</option>
              <option value="conversions">Conversions</option>
              <option value="revenue">Revenue</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h3>
            {renderChange(userChange)}
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">1,850</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">this week</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversion Rate</h3>
            {renderChange(conversionChange)}
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">4.5%</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">this week</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</h3>
            {renderChange(revenueChange)}
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">$17,800</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">this week</span>
          </div>
        </div>
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="h-80">
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="h-80">
            <canvas ref={pieChartRef}></canvas>
          </div>
        </div>
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="h-80">
            <canvas ref={lineChartRef}></canvas>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Device Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(SAMPLE_DATA.deviceDistribution).map(([device, percentage]) => (
              <div key={device}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{device}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 