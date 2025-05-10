import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, Select, message, Popconfirm } from 'antd';
import axios from 'axios';
import ShelvesPage from './ShelvesPage';

interface Section {
  _id: string;
  name: string;
}

interface Rack {
  _id: string;
  name: string;
  section: Section | string;
}

const RacksPage: React.FC = () => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [form] = Form.useForm();
  const [shelfCount, setShelfCount] = useState(1);

  const fetchRacks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/racks');
      setRacks(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке стеллажей');
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get('/api/sections');
      setSections(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке секций');
    }
  };

  useEffect(() => {
    fetchRacks();
    fetchSections();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      const racksRes = await axios.get('/api/racks');
      const rackCount = racksRes.data.length;
      const position = { x: rackCount * 4, y: 0, z: 0 };
      const rackRes = await axios.post('/api/racks', { ...values, position });
      const rack = rackRes.data;
      const shelvesToCreate = Array.from({ length: shelfCount }, (_, i) => ({
        name: `${i + 1} полка - ${values.name}`,
        rack: rack._id,
        level: i
      }));
      await Promise.all(shelvesToCreate.map(shelf => axios.post('/api/shelves', shelf)));
      message.success('Стеллаж и полки созданы');
      setModalOpen(false);
      form.resetFields();
      setShelfCount(1);
      fetchRacks();
    } catch (err) {
      message.error('Ошибка при создании стеллажа или полок');
    }
  };

  const handleEdit = (rack: Rack) => {
    setEditMode(true);
    setSelectedRack(rack);
    form.setFieldsValue({
      ...rack,
      section: typeof rack.section === 'object' ? (rack.section as Section)._id : rack.section,
    });
    setModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selectedRack) return;
    try {
      await axios.put(`/api/racks/${selectedRack._id}`, values);
      message.success('Стеллаж обновлен');
      setModalOpen(false);
      setEditMode(false);
      setSelectedRack(null);
      form.resetFields();
      fetchRacks();
    } catch (err) {
      message.error('Ошибка при обновлении стеллажа');
    }
  };

  const handleDelete = async (rack: Rack) => {
    try {
      await axios.delete(`/api/racks/${rack._id}`);
      message.success('Стеллаж удален');
      fetchRacks();
    } catch (err) {
      message.error('Ошибка при удалении стеллажа');
    }
  };

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Секция', dataIndex: ['section', 'name'], key: 'section', render: (_: any, record: Rack) => typeof record.section === 'object' ? (record.section as Section).name : '' },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Rack) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ paddingLeft: 0 }}>Редактировать</Button>
          <Popconfirm
            title="Удалить стеллаж?"
            description="Внимание! При удалении стеллажа будут удалены все его полки. Товары, находящиеся в ячейках, удалены не будут. Вы уверены, что хотите удалить этот стеллаж?"
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
        <h2>Стеллажи</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedRack(null); setShelfCount(1); }}>
          Создать стеллаж
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={racks}
        columns={columns}
        rowKey="_id"
      />
      <Modal
        title={editMode ? 'Редактировать стеллаж' : 'Создать стеллаж'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditMode(false); setSelectedRack(null); form.resetFields(); setShelfCount(1); }}
        onOk={() => form.submit()}
        okText={editMode ? 'Сохранить' : 'Создать'}
      >
        <Form form={form} layout="vertical" onFinish={editMode ? handleUpdate : handleCreate}>
          <Form.Item name="name" label="Название стеллажа" rules={[{ required: true, message: 'Введите название' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="section" label="Секция" rules={[{ required: true, message: 'Выберите секцию' }]}> 
            <Select placeholder="Выберите секцию">
              {sections.map(s => (
                <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Количество полок (1-5)" required>
            <Select value={shelfCount} onChange={setShelfCount}>
              {[1,2,3,4,5].map(n => (
                <Select.Option key={n} value={n}>{n}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RacksPage; 