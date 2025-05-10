import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, Select, message, Popconfirm } from 'antd';
import axios from 'axios';

interface Warehouse {
  _id: string;
  name: string;
}

interface Section {
  _id: string;
  name: string;
  warehouse: Warehouse | string;
}

const SectionsPage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [form] = Form.useForm();

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/sections');
      setSections(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке секций');
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get('/api/warehouses');
      setWarehouses(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке складов');
    }
  };

  useEffect(() => {
    fetchSections();
    fetchWarehouses();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await axios.post('/api/sections', values);
      message.success('Секция создана');
      setModalOpen(false);
      form.resetFields();
      fetchSections();
    } catch (err) {
      message.error('Ошибка при создании секции');
    }
  };

  const handleEdit = (section: Section) => {
    setEditMode(true);
    setSelectedSection(section);
    form.setFieldsValue({
      ...section,
      warehouse: typeof section.warehouse === 'object' ? (section.warehouse as Warehouse)._id : section.warehouse,
    });
    setModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selectedSection) return;
    try {
      await axios.put(`/api/sections/${selectedSection._id}`, values);
      message.success('Секция обновлена');
      setModalOpen(false);
      setEditMode(false);
      setSelectedSection(null);
      form.resetFields();
      fetchSections();
    } catch (err) {
      message.error('Ошибка при обновлении секции');
    }
  };

  const handleDelete = async (section: Section) => {
    try {
      await axios.delete(`/api/sections/${section._id}`);
      message.success('Секция удалена');
      fetchSections();
    } catch (err) {
      message.error('Ошибка при удалении секции');
    }
  };

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Склад', dataIndex: ['warehouse', 'name'], key: 'warehouse', render: (_: any, record: Section) => typeof record.warehouse === 'object' ? (record.warehouse as Warehouse).name : '' },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Section) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ paddingLeft: 0 }}>Редактировать</Button>
          <Popconfirm
            title="Удалить секцию?"
            description="Вы уверены, что хотите удалить эту секцию?"
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
        <h2>Секции</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedSection(null); }}>
          Создать секцию
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={sections}
        columns={columns}
        rowKey="_id"
      />
      <Modal
        title={editMode ? 'Редактировать секцию' : 'Создать секцию'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditMode(false); setSelectedSection(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okText={editMode ? 'Сохранить' : 'Создать'}
      >
        <Form form={form} layout="vertical" onFinish={editMode ? handleUpdate : handleCreate}>
          <Form.Item name="name" label="Название секции" rules={[{ required: true, message: 'Введите название' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="warehouse" label="Склад" rules={[{ required: true, message: 'Выберите склад' }]}> 
            <Select placeholder="Выберите склад">
              {warehouses.map(w => (
                <Select.Option key={w._id} value={w._id}>{w.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SectionsPage; 