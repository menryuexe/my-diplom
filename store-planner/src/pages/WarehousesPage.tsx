import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, List, message, Card } from 'antd';
import axios from 'axios';

interface Warehouse {
  _id: string;
  name: string;
  description?: string;
  cells: any[];
}

const WarehousesPage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [form] = Form.useForm();

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/warehouses');
      setWarehouses(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке складов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await axios.post('/api/warehouses', { ...values, cells: [] });
      message.success('Склад создан');
      setModalOpen(false);
      form.resetFields();
      fetchWarehouses();
    } catch (err) {
      message.error('Ошибка при создании склада');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Склады</h2>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Создать склад
        </Button>
      </div>
      <List
        loading={loading}
        dataSource={warehouses}
        renderItem={warehouse => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => setSelectedWarehouse(warehouse)}>
                Посмотреть
              </Button>,
              <a
                href={`/warehouse-3d?warehouseId=${warehouse._id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Просмотреть на карте
              </a>
            ]}
          >
            <Card style={{ width: '100%' }}>
              <b>{warehouse.name}</b>
              <div style={{ color: '#888' }}>{warehouse.description}</div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="Создать склад"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Создать"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="Название склада" rules={[{ required: true, message: 'Введите название' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание склада">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={selectedWarehouse?.name}
        open={!!selectedWarehouse}
        onCancel={() => setSelectedWarehouse(null)}
        footer={null}
      >
        <p><b>Описание:</b> {selectedWarehouse?.description}</p>
        <p><b>Количество ячеек:</b> {selectedWarehouse?.cells.length}</p>
        {/* Здесь можно добавить Warehouse3D для выбранного склада */}
      </Modal>
    </div>
  );
};

export default WarehousesPage; 