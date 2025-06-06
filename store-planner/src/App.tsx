import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import WarehousesPage from './pages/WarehousesPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import SectionsPage from './pages/SectionsPage';
import RacksPage from './pages/RacksPage';
import ShelvesPage from './pages/ShelvesPage';
import CellsPage from './pages/CellsPage';
import Warehouse3DPage from './pages/Warehouse3DPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/warehouses" element={<WarehousesPage />} />
          <Route path="/sections" element={<SectionsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/racks" element={<RacksPage />} />
          <Route path="/shelves" element={<ShelvesPage />} />
          <Route path="/cells" element={<CellsPage />} />
          <Route path="/warehouse-3d" element={<Warehouse3DPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
