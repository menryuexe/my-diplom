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
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>();

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/sections');
      setSections(res.data);
    } catch (err) {
      message.error('Помилка при завантаженні секцій');
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get('/api/warehouses');
      setWarehouses(res.data);
    } catch (err) {
      message.error('Помилка при завантаженні складів');
    }
  };

  useEffect(() => {
    fetchSections();
    fetchWarehouses();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await axios.post('/api/sections', values);
      message.success('Секцію створено');
      setModalOpen(false);
      form.resetFields();
      fetchSections();
    } catch (err) {
      message.error('Помилка при створенні секції');
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
      message.success('Секцію оновлено');
      setModalOpen(false);
      setEditMode(false);
      setSelectedSection(null);
      form.resetFields();
      fetchSections();
    } catch (err) {
      message.error('Помилка при оновленні секції');
    }
  };

  const handleDelete = async (section: Section) => {
    try {
      await axios.delete(`/api/sections/${section._id}`);
      message.success('Секцію видалено');
      fetchSections();
    } catch (err) {
      message.error('Помилка при видаленні секції');
    }
  };

  const filteredSections = selectedWarehouseId
    ? sections.filter(s => (typeof s.warehouse === 'object' ? s.warehouse._id : s.warehouse) === selectedWarehouseId)
    : sections;

  const columns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    { title: 'Склад', dataIndex: ['warehouse', 'name'], key: 'warehouse', render: (_: any, record: Section) => typeof record.warehouse === 'object' ? (record.warehouse as Warehouse).name : '' },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: any, record: Section) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ paddingLeft: 0 }}>Редагувати</Button>
          <Popconfirm
            title="Видалити секцію?"
            description="Ви впевнені, що хочете видалити цю секцію?"
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
        <h2>Секції</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedSection(null); }}>
          Створити секцію
        </Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Фільтр за складом"
          value={selectedWarehouseId}
          onChange={value => setSelectedWarehouseId(value)}
          style={{ width: 220 }}
        >
          {warehouses.map(w => (
            <Select.Option key={w._id} value={w._id}>{w.name}</Select.Option>
          ))}
        </Select>
      </div>
      <Table
        loading={loading}
        dataSource={filteredSections}
        columns={columns}
        rowKey="_id"
        size="middle"
        style={{ fontSize: 16 }}
        rowClassName={() => 'custom-table-row'}
      />
      <Modal
        title={editMode ? 'Редагувати секцію' : 'Створити секцію'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditMode(false); setSelectedSection(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okText={editMode ? 'Зберегти' : 'Створити'}
      >
        <Form form={form} layout="vertical" onFinish={editMode ? handleUpdate : handleCreate}>
          <Form.Item name="name" label="Назва секції" rules={[{ required: true, message: 'Введіть назву' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="warehouse" label="Склад" rules={[{ required: true, message: 'Оберіть склад' }]}> 
            <Select placeholder="Оберіть склад">
              {warehouses.map(w => (
                <Select.Option key={w._id} value={w._id}>{w.name}</Select.Option>
              ))}
            </Select>
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

export default SectionsPage; 