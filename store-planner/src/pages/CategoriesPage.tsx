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
      message.error('Ошибка при загрузке категорий');
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
      message.success('Категория создана');
      setModalOpen(false);
      form.resetFields();
      fetchCategories();
    } catch (err) {
      message.error('Ошибка при создании категории');
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
      message.success('Категория обновлена');
      setModalOpen(false);
      setEditMode(false);
      setSelectedCategory(null);
      form.resetFields();
      fetchCategories();
    } catch (err) {
      message.error('Ошибка при обновлении категории');
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      await axios.delete(`/api/categories/${category._id}`);
      message.success('Категория удалена');
      fetchCategories();
    } catch (err) {
      message.error('Ошибка при удалении категории');
    }
  };

  // Фильтрация по поиску
  const filteredCategories = categories.filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Category) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ paddingLeft: 0 }}>Редактировать</Button>
          <Popconfirm
            title="Удалить категорию?"
            description="Вы уверены, что хотите удалить эту категорию?"
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
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Категории</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedCategory(null); }}>
          Создать категорию
        </Button>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Input.Search
          placeholder="Поиск по названию"
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
      />
      <Modal
        title={editMode ? 'Редактировать категорию' : 'Создать категорию'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditMode(false); setSelectedCategory(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okText={editMode ? 'Сохранить' : 'Создать'}
      >
        <Form form={form} layout="vertical" onFinish={editMode ? handleUpdate : handleCreate}>
          <Form.Item name="name" label="Название категории" rules={[{ required: true, message: 'Введите название' }]}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage; 