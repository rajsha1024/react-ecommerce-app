import React, {useState } from 'react';
import { Navbar } from './components';
import HomePage from './pages/homePage';
export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  return (
  <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
    <Navbar
      searchValue={searchQuery}
      onToggleSidebar={() => setIsSidebarOpen(true)}
      onSearchChange={(e) => setSearchQuery(e.target.value)}
    />
    <HomePage 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        searchQuery={searchQuery}
      />
  </div>
  );
}
