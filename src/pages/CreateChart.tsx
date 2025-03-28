import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Save, 
  Download 
} from 'lucide-react';
import { Chart, registerables, ChartType as ChartJsType } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

type DataPoint = {
  id: string;
  label: string;
  value: number;
  color: string;
};

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut';

const INITIAL_DATA: DataPoint[] = [
  { id: '1', label: 'Category 1', value: 25, color: '#4F46E5' },
  { id: '2', label: 'Category 2', value: 40, color: '#10B981' },
  { id: '3', label: 'Category 3', value: 30, color: '#F59E0B' },
];

const DEFAULT_COLORS = [
  '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
];

const CreateChart = () => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [chartTitle, setChartTitle] = useState('My Chart');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(INITIAL_DATA);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const renderChart = () => {
    if (!chartRef.current) return;
    
    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = dataPoints.map(dp => dp.label);
    const data = dataPoints.map(dp => dp.value);
    const colors = dataPoints.map(dp => dp.color);

    chartInstanceRef.current = new Chart(ctx, {
      type: chartType as ChartJsType,
      data: {
        labels: labels,
        datasets: [
          {
            label: chartTitle,
            data: data,
            backgroundColor: chartType === 'line' ? 'rgba(79, 70, 229, 0.2)' : colors,
            borderColor: chartType === 'line' ? '#4F46E5' : colors,
            borderWidth: 1,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: chartTitle,
            font: {
              size: 16,
              weight: 'bold',
            },
            padding: {
              top: 10,
              bottom: 20,
            },
          },
          legend: {
            display: chartType === 'pie' || chartType === 'doughnut',
            position: 'right',
          },
        },
        scales: {
          x: {
            display: chartType !== 'pie' && chartType !== 'doughnut',
            title: {
              display: true,
              text: 'Categories',
            },
          },
          y: {
            display: chartType !== 'pie' && chartType !== 'doughnut',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Values',
            },
          },
        },
      },
    });
  };

  // Render chart on mount
  useEffect(() => {
    renderChart();
    
    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  // Update chart when data or type changes
  useEffect(() => {
    if (chartInstanceRef.current) {
      renderChart();
    }
  }, [dataPoints, chartType, chartTitle]);

  const handleAddDataPoint = () => {
    const newId = (parseInt(dataPoints[dataPoints.length - 1]?.id || '0') + 1).toString();
    const newColor = DEFAULT_COLORS[dataPoints.length % DEFAULT_COLORS.length];
    setDataPoints([
      ...dataPoints,
      { id: newId, label: `Category ${newId}`, value: 0, color: newColor },
    ]);
  };

  const handleRemoveDataPoint = (id: string) => {
    if (dataPoints.length <= 1) return; // Prevent removing all data points
    setDataPoints(dataPoints.filter((dp) => dp.id !== id));
  };

  const handleDataPointChange = (id: string, field: 'label' | 'value' | 'color', value: string | number) => {
    setDataPoints(
      dataPoints.map((dp) =>
        dp.id === id ? { ...dp, [field]: value } : dp
      )
    );
  };

  const handleSaveChart = () => {
    if (!chartInstanceRef.current) return;
    
    // In a real application, this would save to a database
    const chartData = {
      type: chartType,
      title: chartTitle,
      data: dataPoints,
      createdAt: new Date().toISOString(),
    };
    
    console.log('Chart saved:', chartData);
    alert('Chart saved successfully!');
  };

  const handleDownloadChart = () => {
    if (!chartRef.current) return;
    
    const url = chartRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${chartTitle.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = url;
    link.click();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dropdown = document.getElementById('chart-type-dropdown');
      const button = document.getElementById('chart-type-button');
      
      if (showTypeDropdown && 
          dropdown && 
          button && 
          !dropdown.contains(e.target as Node) && 
          !button.contains(e.target as Node)) {
        setShowTypeDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTypeDropdown]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Create Chart
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart Configuration */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Chart Settings
          </h2>

          <div className="space-y-4">
            {/* Chart Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chart Title
              </label>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>

            {/* Chart Type Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chart Type
              </label>
              <button
                id="chart-type-button"
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <span className="flex items-center">
                  {chartType === 'bar' && <BarChart className="w-4 h-4 mr-2" />}
                  {chartType === 'line' && <LineChartIcon className="w-4 h-4 mr-2" />}
                  {(chartType === 'pie' || chartType === 'doughnut') && (
                    <PieChartIcon className="w-4 h-4 mr-2" />
                  )}
                  {chartType === 'bar' && 'Bar Chart'}
                  {chartType === 'line' && 'Line Chart'}
                  {chartType === 'pie' && 'Pie Chart'}
                  {chartType === 'doughnut' && 'Doughnut Chart'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showTypeDropdown && (
                <div 
                  id="chart-type-dropdown"
                  className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md border border-gray-300 dark:border-gray-600"
                >
                  <ul className="py-1">
                    <li
                      className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => {
                        setChartType('bar');
                        setShowTypeDropdown(false);
                      }}
                    >
                      <BarChart className="w-4 h-4 mr-2" />
                      Bar Chart
                    </li>
                    <li
                      className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => {
                        setChartType('line');
                        setShowTypeDropdown(false);
                      }}
                    >
                      <LineChartIcon className="w-4 h-4 mr-2" />
                      Line Chart
                    </li>
                    <li
                      className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => {
                        setChartType('pie');
                        setShowTypeDropdown(false);
                      }}
                    >
                      <PieChartIcon className="w-4 h-4 mr-2" />
                      Pie Chart
                    </li>
                    <li
                      className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => {
                        setChartType('doughnut');
                        setShowTypeDropdown(false);
                      }}
                    >
                      <PieChartIcon className="w-4 h-4 mr-2" />
                      Doughnut Chart
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Data Points */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Points
                </label>
                <button
                  type="button"
                  onClick={handleAddDataPoint}
                  className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {dataPoints.map((dp) => (
                  <div
                    key={dp.id}
                    className="flex flex-col p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-750"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Data Point {dp.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDataPoint(dp.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={dataPoints.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={dp.label}
                          onChange={(e) =>
                            handleDataPointChange(dp.id, 'label', e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Value
                        </label>
                        <input
                          type="number"
                          value={dp.value}
                          onChange={(e) =>
                            handleDataPointChange(
                              dp.id,
                              'value',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Color
                        </label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            value={dp.color}
                            onChange={(e) =>
                              handleDataPointChange(dp.id, 'color', e.target.value)
                            }
                            className="w-8 h-8 p-0 border-0 rounded mr-2"
                          />
                          <input
                            type="text"
                            value={dp.color}
                            onChange={(e) =>
                              handleDataPointChange(dp.id, 'color', e.target.value)
                            }
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={handleSaveChart}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Chart
            </button>
            <button
              type="button"
              onClick={handleDownloadChart}
              className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>

        {/* Chart Preview */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Chart Preview
          </h2>
          <div className="h-[500px] w-full">
            <canvas ref={chartRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChart;