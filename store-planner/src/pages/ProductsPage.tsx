import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, Select, message, Popconfirm } from 'antd';
import axios from 'axios';

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

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Категория', dataIndex: ['category', 'name'], key: 'category', render: (_: any, record: Product) => typeof record.category === 'object' ? (record.category as Category).name : '' },
    { title: 'Штрихкод', dataIndex: 'barcode', key: 'barcode' },
    { title: 'RFID', dataIndex: 'rfid', key: 'rfid' },
    { title: 'Количество', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Описание', dataIndex: 'description', key: 'description' },
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
      <Table
        loading={loading}
        dataSource={products}
        columns={columns}
        rowKey="_id"
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