import React, {useState } from 'react';
import { Navbar } from './components';
import HomePage from './pages/homePage';
export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
  <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
    <Navbar 
      onToggleSidebar={() => setIsSidebarOpen(true)} 
    />
    <HomePage 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
  </div>
  );
}
