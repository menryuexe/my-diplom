import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, Select, message, Popconfirm } from 'antd';
import axios from 'axios';

interface Shelf {
  _id: string;
  name: string;
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
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
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

  useEffect(() => {
    fetchCells();
    fetchShelves();
    fetchProducts();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await axios.post('/api/cells', values);
      message.success('Ячейка создана');
      setModalOpen(false);
      form.resetFields();
      fetchCells();
    } catch (err) {
      message.error('Ошибка при создании ячейки');
    }
  };

  const handleEdit = (cell: Cell) => {
    setEditMode(true);
    setSelectedCell(cell);
    form.setFieldsValue({
      ...cell,
      shelf: typeof cell.shelf === 'object' ? (cell.shelf as Shelf)._id : cell.shelf,
      product: cell.product && typeof cell.product === 'object' ? (cell.product as Product)._id : cell.product,
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
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedCell(null); }}>
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
        onCancel={() => { setModalOpen(false); setEditMode(false); setSelectedCell(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okText={editMode ? 'Сохранить' : 'Создать'}
      >
        <Form form={form} layout="vertical" onFinish={editMode ? handleUpdate : handleCreate}>
          <Form.Item name="name" label="Название ячейки" rules={[{ required: true, message: 'Введите название' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="shelf" label="Полка" rules={[{ required: true, message: 'Выберите полку' }]}> 
            <Select placeholder="Выберите полку">
              {shelves.map(s => (
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