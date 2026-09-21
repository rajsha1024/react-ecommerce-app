import React, {useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Navbar } from './components';
import HomePage from './pages/homePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/checkoutPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/authPage';


export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = useNavigate();
  return (
  <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
    <Navbar
      searchValue={searchQuery}
      onToggleSidebar={() => setIsSidebarOpen(true)}
      onSearchChange={(e) => setSearchQuery(e.target.value)}
    />

    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            searchQuery={searchQuery}
          />
        }
      />
      
      <Route 
        path="/product/:id" 
        element={<ProductDetailPage
            onBack={() => navigate(-1)}
          />} 
      />

      <Route path="/checkout" element={
        <ProtectedRoute>
            <CheckoutPage />
        </ProtectedRoute>
      } />

      <Route path="/auth" element={<AuthPage />} />

    </Routes>

     
  </div>
  );
}
