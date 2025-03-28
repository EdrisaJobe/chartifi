import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Database, 
  PieChart, 
  LineChart, 
  Sun, 
  Moon, 
  ChevronRight,
  PlusSquare,
  FileUp,
  Table
} from 'lucide-react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage and system preference on initial load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Dispatch custom events when state changes
  useEffect(() => {
    if (isExpanded) {
      window.dispatchEvent(new Event('sidebar-expand'));
    } else {
      window.dispatchEvent(new Event('sidebar-collapse'));
    }
  }, [isExpanded]);

  // Handle theme toggle and persistence
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const hasThemePreference = localStorage.getItem('theme') !== null;
      if (!hasThemePreference) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div 
      className={`h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed left-0 top-0 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-16'} z-10`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 relative">
        <div className={`flex items-center ${isExpanded ? 'gap-2' : 'justify-center'}`}>
          <div className="h-6 w-6 shrink-0 relative">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 64 64" 
              className="text-indigo-600 dark:text-indigo-400"
            >
              {/* Gradient background - we'll use a solid color that matches */}
              <rect width="64" height="64" rx="12" fill="currentColor" />
              
              {/* Bar chart elements */}
              <rect x="14" y="34" width="8" height="18" fill="white" fillOpacity="0.9" />
              <rect x="28" y="24" width="8" height="28" fill="white" fillOpacity="0.9" />
              <rect x="42" y="14" width="8" height="38" fill="white" fillOpacity="0.9" />
              
              {/* Circular outline */}
              <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <span className={`text-xl font-bold text-gray-800 dark:text-white transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
          Chartifi
          </span>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute top-1/2 -translate-y-1/2 -right-4 bg-indigo-600 dark:bg-indigo-500 text-white p-1.5 rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 hover:shadow-xl ${isExpanded ? 'rotate-180' : ''} border-2 border-white dark:border-gray-800`}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-2 px-3">
          <li>
            <Link to="/" className={`flex items-center rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 ${isExpanded ? 'gap-3 px-3' : 'justify-center'}`}>
              <Home className="h-5 w-5 shrink-0" />
              <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link to="/data-sources" className={`flex items-center rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 ${isExpanded ? 'gap-3 px-3' : 'justify-center'}`}>
              <Database className="h-5 w-5 shrink-0" />
              <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                Data Sources
              </span>
            </Link>
          </li>
          <li>
            <Link to="/analytics" className={`flex items-center rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 ${isExpanded ? 'gap-3 px-3' : 'justify-center'}`}>
              <PieChart className="h-5 w-5 shrink-0" />
              <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                Analytics
              </span>
            </Link>
          </li>
          <li>
            <Link to="/reports" className={`flex items-center rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 ${isExpanded ? 'gap-3 px-3' : 'justify-center'}`}>
              <LineChart className="h-5 w-5 shrink-0" />
              <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                Reports
              </span>
            </Link>
          </li>

          <li className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className={`text-xs font-medium text-gray-400 dark:text-gray-500 px-3 ${!isExpanded && 'sr-only'}`}>
              Create & Import
            </span>
          </li>
          <li>
            <Link to="/create-chart" className={`flex items-center rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 ${isExpanded ? 'gap-3 px-3' : 'justify-center'}`}>
              <PlusSquare className="h-5 w-5 shrink-0" />
              <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                Create Chart
              </span>
            </Link>
          </li>
          <li>
            <Link to="/upload-pdf" className={`flex items-center rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 ${isExpanded ? 'gap-3 px-3' : 'justify-center'}`}>
              <FileUp className="h-5 w-5 shrink-0" />
              <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                Upload PDF
              </span>
            </Link>
          </li>
          <li>
            <Link to="/import-excel" className={`flex items-center rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 ${isExpanded ? 'gap-3 px-3' : 'justify-center'}`}>
              <Table className="h-5 w-5 shrink-0" />
              <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                Import Excel
              </span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="py-4 px-3 border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`flex items-center rounded-lg p-2 w-full text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 ${isExpanded ? 'gap-3 px-3' : 'justify-center'}`}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 shrink-0" />
          ) : (
            <Moon className="h-5 w-5 shrink-0" />
          )}
          <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;