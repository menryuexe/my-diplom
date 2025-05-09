import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout';
import Warehouse3D from './components/Warehouse3D';
import WarehousesPage from './pages/WarehousesPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import './App.css';

const HomePage: React.FC = () => {
  return (
    <div className="store-plan-container" style={{ minHeight: 600, minWidth: 900 }}>
      <Warehouse3D />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/warehouses" element={<WarehousesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
