import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, message, Popconfirm } from 'antd';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      message.error('Помилка при завантаженні категорій');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await axios.post('/api/categories', values);
      message.success('Категорію створено');
      setModalOpen(false);
      form.resetFields();
      fetchCategories();
    } catch (err) {
      message.error('Помилка при створенні категорії');
    }
  };

  const handleEdit = (category: Category) => {
    setEditMode(true);
    setSelectedCategory(category);
    form.setFieldsValue(category);
    setModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selectedCategory) return;
    try {
      await axios.put(`/api/categories/${selectedCategory._id}`, values);
      message.success('Категорію оновлено');
      setModalOpen(false);
      setEditMode(false);
      setSelectedCategory(null);
      form.resetFields();
      fetchCategories();
    } catch (err) {
      message.error('Помилка при оновленні категорії');
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      await axios.delete(`/api/categories/${category._id}`);
      message.success('Категорію видалено');
      fetchCategories();
    } catch (err) {
      message.error('Помилка при видаленні категорії');
    }
  };

  // Фильтрация по поиску
  const filteredCategories = categories.filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: any, record: Category) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ paddingLeft: 0 }}>Редагувати</Button>
          <Popconfirm
            title="Видалити категорію?"
            description="Ви впевнені, що хочете видалити цю категорію?"
            onConfirm={() => handleDelete(record)}
            okText="Так"
            cancelText="Ні"
          >
            <Button type="link" danger>Видалити</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Категорії</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedCategory(null); }}>
          Створити категорію
        </Button>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Input.Search
          placeholder="Пошук за назвою"
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 250 }}
        />
      </div>
      <Table
        loading={loading}
        dataSource={filteredCategories}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 8, showSizeChanger: true, pageSizeOptions: [5, 8, 20, 50] }}
        size="middle"
        style={{ fontSize: 16 }}
        rowClassName={() => 'custom-table-row'}
      />
      <Modal
        title={editMode ? 'Редагувати категорію' : 'Створити категорію'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditMode(false); setSelectedCategory(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okText={editMode ? 'Зберегти' : 'Створити'}
      >
        <Form form={form} layout="vertical" onFinish={editMode ? handleUpdate : handleCreate}>
          <Form.Item name="name" label="Назва категорії" rules={[{ required: true, message: 'Введіть назву' }]}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <style>
        {`
        .custom-table-row td {
          padding-top: 14px !important;
          padding-bottom: 14px !important;
        }
        .ant-table-thead > tr > th {
          font-size: 17px;
          background: #fafbfc;
        }
        `}
      </style>
    </div>
  );
};

export default CategoriesPage; 