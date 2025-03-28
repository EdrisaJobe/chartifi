import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} Chartifi. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;