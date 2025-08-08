import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <div className="hidden lg:block lg:w-72 lg:flex-shrink-0">
        <Sidebar isOpen={true} onToggle={toggleSidebar} />
      </div>
      
      {/* Mobile Sidebar - overlay */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header onMenuToggle={toggleSidebar} />
        
        <main className="flex-1 overflow-hidden lg:pt-0 pt-16">
          <div className="h-full overflow-y-auto p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;