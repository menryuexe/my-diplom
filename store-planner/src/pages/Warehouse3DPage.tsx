import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Warehouse3D from '../components/Warehouse3D';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Warehouse3DPage: React.FC = () => {
  const query = useQuery();
  const cellId = query.get('cellId');
  const warehouseId = query.get('warehouseId');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data));
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Warehouse3D highlightCellId={cellId} categories={categories} warehouseId={warehouseId} />
    </div>
  );
};

export default Warehouse3DPage; 