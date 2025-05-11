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
      message.error('Помилка при завантаженні полиць');
    } finally {
      setLoading(false);
    }
  };

  const fetchRacks = async () => {
    try {
      const res = await axios.get('/api/racks');
      setRacks(res.data);
    } catch (err) {
      message.error('Помилка при завантаженні стелажів');
    }
  };

  useEffect(() => {
    fetchShelves();
    fetchRacks();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await axios.post('/api/shelves', values);
      message.success('Полицю створено');
      setModalOpen(false);
      form.resetFields();
      fetchShelves();
    } catch (err) {
      message.error('Помилка при створенні полиці');
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
      message.success('Полицю оновлено');
      setModalOpen(false);
      setEditMode(false);
      setSelectedShelf(null);
      form.resetFields();
      fetchShelves();
    } catch (err) {
      message.error('Помилка при оновленні полиці');
    }
  };

  const handleDelete = async (shelf: Shelf) => {
    try {
      await axios.delete(`/api/shelves/${shelf._id}`);
      message.success('Полицю видалено');
      fetchShelves();
    } catch (err) {
      message.error('Помилка при видаленні полиці');
    }
  };

  const columns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    {
      title: 'Стелаж',
      dataIndex: ['rack', 'name'],
      key: 'rack',
      render: (_: any, record: Shelf) =>
        record.rack && typeof record.rack === 'object'
          ? record.rack.name || '—'
          : '—',
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: any, record: Shelf) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ paddingLeft: 0 }}>Редагувати</Button>
          <Popconfirm
            title="Видалити полицю?"
            description="Ви впевнені, що хочете видалити цю полицю?"
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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Полиці</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedShelf(null); }}>
          Створити полицю
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={shelves}
        columns={columns}
        rowKey="_id"
      />
      <Modal
        title={editMode ? 'Редагувати полицю' : 'Створити полицю'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditMode(false); setSelectedShelf(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okText={editMode ? 'Зберегти' : 'Створити'}
      >
        <Form form={form} layout="vertical" onFinish={editMode ? handleUpdate : handleCreate}>
          <Form.Item name="name" label="Назва полиці" rules={[{ required: true, message: 'Введіть назву' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="rack" label="Стелаж" rules={[{ required: true, message: 'Оберіть стелаж' }]}> 
            <Select placeholder="Оберіть стелаж">
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