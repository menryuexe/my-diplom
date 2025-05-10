import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, Select, message, Popconfirm } from 'antd';
import axios from 'axios';

interface Rack {
  _id: string;
  name: string;
}

interface Shelf {
  _id: string;
  name: string;
  rack: Rack | string;
}

const ShelvesPage: React.FC = () => {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  const [form] = Form.useForm();

  const fetchShelves = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/shelves');
      setShelves(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке полок');
    } finally {
      setLoading(false);
    }
  };

  const fetchRacks = async () => {
    try {
      const res = await axios.get('/api/racks');
      setRacks(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке стеллажей');
    }
  };

  useEffect(() => {
    fetchShelves();
    fetchRacks();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await axios.post('/api/shelves', values);
      message.success('Полка создана');
      setModalOpen(false);
      form.resetFields();
      fetchShelves();
    } catch (err) {
      message.error('Ошибка при создании полки');
    }
  };

  const handleEdit = (shelf: Shelf) => {
    setEditMode(true);
    setSelectedShelf(shelf);
    form.setFieldsValue({
      ...shelf,
      rack: typeof shelf.rack === 'object' ? (shelf.rack as Rack)._id : shelf.rack,
    });
    setModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selectedShelf) return;
    try {
      await axios.put(`/api/shelves/${selectedShelf._id}`, values);
      message.success('Полка обновлена');
      setModalOpen(false);
      setEditMode(false);
      setSelectedShelf(null);
      form.resetFields();
      fetchShelves();
    } catch (err) {
      message.error('Ошибка при обновлении полки');
    }
  };

  const handleDelete = async (shelf: Shelf) => {
    try {
      await axios.delete(`/api/shelves/${shelf._id}`);
      message.success('Полка удалена');
      fetchShelves();
    } catch (err) {
      message.error('Ошибка при удалении полки');
    }
  };

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Стеллаж', dataIndex: ['rack', 'name'], key: 'rack', render: (_: any, record: Shelf) => typeof record.rack === 'object' ? (record.rack as Rack).name : '' },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Shelf) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ paddingLeft: 0 }}>Редактировать</Button>
          <Popconfirm
            title="Удалить полку?"
            description="Вы уверены, что хотите удалить эту полку?"
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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Полки</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedShelf(null); }}>
          Создать полку
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={shelves}
        columns={columns}
        rowKey="_id"
      />
      <Modal
        title={editMode ? 'Редактировать полку' : 'Создать полку'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditMode(false); setSelectedShelf(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okText={editMode ? 'Сохранить' : 'Создать'}
      >
        <Form form={form} layout="vertical" onFinish={editMode ? handleUpdate : handleCreate}>
          <Form.Item name="name" label="Название полки" rules={[{ required: true, message: 'Введите название' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="rack" label="Стеллаж" rules={[{ required: true, message: 'Выберите стеллаж' }]}> 
            <Select placeholder="Выберите стеллаж">
              {racks.map(r => (
                <Select.Option key={r._id} value={r._id}>{r.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShelvesPage; 