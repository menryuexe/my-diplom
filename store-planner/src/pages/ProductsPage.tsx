import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, Select, message, Popconfirm } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  category: Category | string;
  barcode: string;
  rfid: string;
  description?: string;
  quantity: number;
}

interface Cell {
  _id: string;
  name: string;
  product: Product | string | null;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [rfidFilter, setRfidFilter] = useState('');
  const [barcodeFilter, setBarcodeFilter] = useState('');
  const [highlightCellId, setHighlightCellId] = useState<string | null>(null);
  const [cells, setCells] = useState<Cell[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке товаров');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке категорий');
    }
  };

  const fetchCells = async () => {
    try {
      const res = await axios.get('/api/cells');
      setCells(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке ячеек');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCells();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await axios.post('/api/products', values);
      message.success('Товар создан');
      setModalOpen(false);
      form.resetFields();
      fetchProducts();
    } catch (err) {
      message.error('Ошибка при создании товара');
    }
  };

  const handleEdit = (product: Product) => {
    setEditMode(true);
    setSelectedProduct(product);
    form.setFieldsValue({
      ...product,
      category: typeof product.category === 'object' ? (product.category as Category)._id : product.category,
    });
    setModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selectedProduct) return;
    try {
      await axios.put(`/api/products/${selectedProduct._id}`, values);
      message.success('Товар обновлен');
      setModalOpen(false);
      setEditMode(false);
      setSelectedProduct(null);
      form.resetFields();
      fetchProducts();
    } catch (err) {
      message.error('Ошибка при обновлении товара');
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      await axios.delete(`/api/products/${product._id}`);
      message.success('Товар удален');
      fetchProducts();
    } catch (err) {
      message.error('Ошибка при удалении товара');
    }
  };

  // Фильтрация по поиску, категории, RFID и штрихкоду
  const filteredProducts = products.filter(product => {
    const matchesName = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? (
      typeof product.category === 'object'
        ? (product.category as Category)._id === categoryFilter
        : product.category === categoryFilter
    ) : true;
    const matchesRfid = product.rfid.toLowerCase().includes(rfidFilter.toLowerCase());
    const matchesBarcode = product.barcode.toLowerCase().includes(barcodeFilter.toLowerCase());
    return matchesName && matchesCategory && matchesRfid && matchesBarcode;
  });

  // Функция для перехода к ячейке на плане
  const handleShowOnPlan = (product: Product) => {
    // Ищем ячейку, где product._id совпадает
    const cell = cells.find(cell => {
      if (!cell.product) return false;
      if (typeof cell.product === 'object') {
        return (cell.product as Product)._id === product._id;
      }
      return cell.product === product._id;
    });
    if (cell) {
      setHighlightCellId(cell._id);
    } else {
      message.info('Ячейка для этого товара не найдена');
    }
  };

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name', sorter: (a: Product, b: Product) => a.name.localeCompare(b.name) },
    { title: 'Категория', dataIndex: ['category', 'name'], key: 'category', sorter: (a: Product, b: Product) => {
      const aName = typeof a.category === 'object' && a.category ? (a.category as Category).name : '';
      const bName = typeof b.category === 'object' && b.category ? (b.category as Category).name : '';
      return aName.localeCompare(bName);
    }, render: (_: any, record: Product) => (typeof record.category === 'object' && record.category ? (record.category as Category).name : '—') },
    { title: 'Штрихкод', dataIndex: 'barcode', key: 'barcode', sorter: (a: Product, b: Product) => a.barcode.localeCompare(b.barcode) },
    { title: 'RFID', dataIndex: 'rfid', key: 'rfid', sorter: (a: Product, b: Product) => a.rfid.localeCompare(b.rfid) },
    { title: 'Количество', dataIndex: 'quantity', key: 'quantity', sorter: (a: Product, b: Product) => a.quantity - b.quantity },
    { title: 'Описание', dataIndex: 'description', key: 'description' },
    {
      title: 'Показать на плане',
      key: 'showOnPlan',
      render: (_: any, record: Product) => {
        const cell = cells.find(cell => {
          if (!cell.product) return false;
          if (typeof cell.product === 'object') {
            return (cell.product as Product)._id === record._id;
          }
          return cell.product === record._id;
        });
        return cell ? (
          <a
            href={`/warehouse-3d?cellId=${cell._id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Показать на плане
          </a>
        ) : (
          <span style={{ color: '#aaa' }}>Нет ячейки</span>
        );
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Product) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ paddingLeft: 0 }}>Редактировать</Button>
          <Popconfirm
            title="Удалить товар?"
            description="Вы уверены, что хотите удалить этот товар?"
            onConfirm={() => handleDelete(record)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger>Удалить</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Товары</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedProduct(null); }}>
          Создать товар
        </Button>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <Input.Search
          placeholder="Поиск по названию"
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          allowClear
          placeholder="Фильтр по категории"
          value={categoryFilter}
          onChange={value => setCategoryFilter(value)}
          style={{ width: 180 }}
        >
          {categories.map(cat => (
            <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
          ))}
        </Select>
        <Input
          placeholder="Фильтр по RFID"
          allowClear
          value={rfidFilter}
          onChange={e => setRfidFilter(e.target.value)}
          style={{ width: 150 }}
        />
        <Input
          placeholder="Фильтр по штрихкоду"
          allowClear
          value={barcodeFilter}
          onChange={e => setBarcodeFilter(e.target.value)}
          style={{ width: 150 }}
        />
      </div>
      <Table
        loading={loading}
        dataSource={filteredProducts}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: [5, 10, 20, 50] }}
      />
      <Modal
        title={editMode ? 'Редактировать товар' : 'Создать товар'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditMode(false); setSelectedProduct(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okText={editMode ? 'Сохранить' : 'Создать'}
      >
        <Form form={form} layout="vertical" onFinish={editMode ? handleUpdate : handleCreate}>
          <Form.Item name="name" label="Название товара" rules={[{ required: true, message: 'Введите название' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Категория" rules={[{ required: true, message: 'Выберите категорию' }]}> 
            <Select placeholder="Выберите категорию">
              {categories.map(cat => (
                <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="barcode" label="Штрихкод" rules={[{ required: true, message: 'Введите штрихкод' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="rfid" label="RFID" rules={[{ required: true, message: 'Введите RFID' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Количество" rules={[{ required: true, message: 'Введите количество' }]}> 
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage; 