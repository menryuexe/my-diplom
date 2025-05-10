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

interface Product {
  _id: string;
  name: string;
}

interface Cell {
  _id: string;
  name: string;
  shelf: Shelf | string;
  product: Product | string | null;
}

const CellsPage: React.FC = () => {
  const [cells, setCells] = useState<Cell[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [selectedRackId, setSelectedRackId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const fetchCells = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/cells');
      setCells(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке ячеек');
    } finally {
      setLoading(false);
    }
  };

  const fetchShelves = async () => {
    try {
      const res = await axios.get('/api/shelves');
      setShelves(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке полок');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      message.error('Ошибка при загрузке товаров');
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
    fetchCells();
    fetchShelves();
    fetchProducts();
    fetchRacks();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await axios.post('/api/cells', values);
      message.success('Ячейка создана');
      setModalOpen(false);
      form.resetFields();
      setSelectedRackId(null);
      fetchCells();
    } catch (err) {
      message.error('Ошибка при создании ячейки');
    }
  };

  const handleEdit = (cell: Cell) => {
    setEditMode(true);
    setSelectedCell(cell);
    let rackId = null;
    if (cell.shelf && typeof cell.shelf === 'object') {
      rackId = (cell.shelf as Shelf).rack;
      if (typeof rackId === 'object') rackId = rackId._id;
    }
    setSelectedRackId(rackId);
    form.setFieldsValue({
      ...cell,
      shelf: typeof cell.shelf === 'object' ? (cell.shelf as Shelf)._id : cell.shelf,
      product: cell.product && typeof cell.product === 'object' ? (cell.product as Product)._id : cell.product,
      rack: rackId,
    });
    setModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selectedCell) return;
    try {
      await axios.put(`/api/cells/${selectedCell._id}`, values);
      message.success('Ячейка обновлена');
      setModalOpen(false);
      setEditMode(false);
      setSelectedCell(null);
      form.resetFields();
      fetchCells();
    } catch (err) {
      message.error('Ошибка при обновлении ячейки');
    }
  };

  const handleDelete = async (cell: Cell) => {
    try {
      await axios.delete(`/api/cells/${cell._id}`);
      message.success('Ячейка удалена');
      fetchCells();
    } catch (err) {
      message.error('Ошибка при удалении ячейки');
    }
  };

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    {
      title: 'Полка',
      dataIndex: ['shelf', 'name'],
      key: 'shelf',
      render: (_: any, record: Cell) =>
        record.shelf && typeof record.shelf === 'object'
          ? record.shelf.name || '—'
          : '—',
    },
    { title: 'Товар', dataIndex: ['product', 'name'], key: 'product', render: (_: any, record: Cell) => record.product && typeof record.product === 'object' ? (record.product as Product).name : '' },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Cell) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ paddingLeft: 0 }}>Редактировать</Button>
          <Popconfirm
            title="Удалить ячейку?"
            description="Вы уверены, что хотите удалить эту ячейку?"
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
        <h2>Ячейки</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedCell(null); setSelectedRackId(null); }}>
          Создать ячейку
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={cells}
        columns={columns}
        rowKey="_id"
      />
      <Modal
        title={editMode ? 'Редактировать ячейку' : 'Создать ячейку'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditMode(false); setSelectedCell(null); form.resetFields(); setSelectedRackId(null); }}
        onOk={() => form.submit()}
        okText={editMode ? 'Сохранить' : 'Создать'}
      >
        <Form form={form} layout="vertical" onFinish={editMode ? handleUpdate : handleCreate}>
          <Form.Item name="name" label="Название ячейки" rules={[{ required: true, message: 'Введите название' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="rack" label="Стеллаж" rules={[{ required: true, message: 'Выберите стеллаж' }]}> 
            <Select
              placeholder="Выберите стеллаж"
              onChange={rackId => {
                setSelectedRackId(rackId);
                form.setFieldsValue({ shelf: undefined });
              }}
              value={selectedRackId || undefined}
            >
              {racks.map(r => (
                <Select.Option key={r._id} value={r._id}>{r.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="shelf" label="Полка" rules={[{ required: true, message: 'Выберите полку' }]}> 
            <Select placeholder="Выберите полку" disabled={!selectedRackId}>
              {shelves.filter(s => {
                const rackId = typeof s.rack === 'object' ? s.rack._id : s.rack;
                return rackId === selectedRackId;
              }).map(s => (
                <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="product" label="Товар">
            <Select placeholder="Выберите товар (необязательно)" allowClear>
              {products.map(p => (
                <Select.Option key={p._id} value={p._id}>{p.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CellsPage; 