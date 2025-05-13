import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, Select, message, Popconfirm } from 'antd';
import axios from 'axios';

interface Rack {
  _id: string;
  name: string;
  section: string | Section;
}

interface Shelf {
  _id: string;
  name: string;
  rack: Rack | string;
}

interface Section {
  _id: string;
  name: string;
  warehouse: Warehouse | string;
}

interface Warehouse {
  _id: string;
  name: string;
}

const ShelvesPage: React.FC = () => {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>();
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>();
  const [selectedRackId, setSelectedRackId] = useState<string | undefined>();
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

  const fetchSections = async () => {
    try {
      const res = await axios.get('/api/sections');
      setSections(res.data);
    } catch (err) {
      message.error('Помилка при завантаженні секцій');
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
    fetchShelves();
    fetchRacks();
    fetchSections();
    fetchWarehouses();
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

  const filteredSections = selectedWarehouseId
    ? sections.filter(s => (typeof s.warehouse === 'object' ? s.warehouse._id : s.warehouse) === selectedWarehouseId)
    : sections;
  const filteredRacks = selectedSectionId
    ? racks.filter(r => {
        const sectionId = typeof r.section === 'object' ? r.section._id : r.section;
        return sectionId === selectedSectionId;
      })
    : selectedWarehouseId
      ? racks.filter(r => {
          const sectionId = typeof r.section === 'object' ? r.section._id : r.section;
          const section = sections.find(s => s._id === sectionId);
          return section && (typeof section.warehouse === 'object' ? section.warehouse._id : section.warehouse) === selectedWarehouseId;
        })
      : racks;
  const filteredShelves = shelves.filter(shelf => {
    const rackId = typeof shelf.rack === 'object' ? shelf.rack._id : shelf.rack;
    const rack = racks.find(r => r._id === rackId);
    if (!rack) return false;

    // Фильтр по стеллажу
    if (selectedRackId && rackId !== selectedRackId) return false;

    // Фильтр по секции
    const sectionId = typeof rack.section === 'object' ? rack.section._id : rack.section;
    if (selectedSectionId && sectionId !== selectedSectionId) return false;

    // Фильтр по складу
    const section = sections.find(s => s._id === sectionId);
    if (selectedWarehouseId && (!section || (typeof section.warehouse === 'object' ? section.warehouse._id : section.warehouse) !== selectedWarehouseId)) return false;

    return true;
  });

  const columns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    {
      title: 'Склад',
      key: 'warehouse',
      align: 'center' as const,
      render: (_: any, record: Shelf) => {
        const rack = racks.find(r => r._id === (typeof record.rack === 'object' ? record.rack._id : record.rack));
        const section = rack && sections.find(s => s._id === (typeof rack.section === 'object' ? rack.section._id : rack.section));
        const warehouse = section && warehouses.find(w => w._id === (typeof section.warehouse === 'object' ? section.warehouse._id : section.warehouse));
        return warehouse ? warehouse.name : '—';
      }
    },
    {
      title: 'Секція',
      key: 'section',
      align: 'center' as const,
      render: (_: any, record: Shelf) => {
        const rack = racks.find(r => r._id === (typeof record.rack === 'object' ? record.rack._id : record.rack));
        const section = rack && sections.find(s => s._id === (typeof rack.section === 'object' ? rack.section._id : rack.section));
        return section ? section.name : '—';
      }
    },
    {
      title: 'Стелаж',
      key: 'rack',
      align: 'center' as const,
      render: (_: any, record: Shelf) => {
        const rack = racks.find(r => r._id === (typeof record.rack === 'object' ? record.rack._id : record.rack));
        return rack ? rack.name : '—';
      }
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
      align: 'center' as const,
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Полиці</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedShelf(null); }}>
          Створити полицю
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Фільтр за складом"
          value={selectedWarehouseId}
          onChange={value => {
            setSelectedWarehouseId(value);
            setSelectedSectionId(undefined);
            setSelectedRackId(undefined);
          }}
          style={{ width: 180 }}
        >
          {warehouses.map(w => (
            <Select.Option key={w._id} value={w._id}>{w.name}</Select.Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Фільтр за секцією"
          value={selectedSectionId}
          onChange={value => {
            setSelectedSectionId(value);
            setSelectedRackId(undefined);
          }}
          style={{ width: 180 }}
          disabled={!selectedWarehouseId && !sections.length}
        >
          {filteredSections.map(s => (
            <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Фільтр за стелажем"
          value={selectedRackId}
          onChange={value => setSelectedRackId(value)}
          style={{ width: 180 }}
          disabled={!selectedSectionId && !racks.length}
        >
          {filteredRacks.map(r => (
            <Select.Option key={r._id} value={r._id}>{r.name}</Select.Option>
          ))}
        </Select>
      </div>
      <Table
        loading={loading}
        dataSource={filteredShelves}
        columns={[
          { title: 'Назва', dataIndex: 'name', key: 'name' },
          {
            title: 'Склад',
            key: 'warehouse',
            align: 'center' as const,
            render: (_: any, record: Shelf) => {
              const rack = racks.find(r => r._id === (typeof record.rack === 'object' ? record.rack._id : record.rack));
              const section = rack && sections.find(s => s._id === (typeof rack.section === 'object' ? rack.section._id : rack.section));
              const warehouse = section && warehouses.find(w => w._id === (typeof section.warehouse === 'object' ? section.warehouse._id : section.warehouse));
              return warehouse ? warehouse.name : '—';
            }
          },
          {
            title: 'Секція',
            key: 'section',
            align: 'center' as const,
            render: (_: any, record: Shelf) => {
              const rack = racks.find(r => r._id === (typeof record.rack === 'object' ? record.rack._id : record.rack));
              const section = rack && sections.find(s => s._id === (typeof rack.section === 'object' ? rack.section._id : rack.section));
              return section ? section.name : '—';
            }
          },
          {
            title: 'Стелаж',
            key: 'rack',
            align: 'center' as const,
            render: (_: any, record: Shelf) => {
              const rack = racks.find(r => r._id === (typeof record.rack === 'object' ? record.rack._id : record.rack));
              return rack ? rack.name : '—';
            }
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
            align: 'center' as const,
          },
        ]}
        rowKey="_id"
        size="middle"
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: [5, 10, 20, 50] }}
        style={{ fontSize: 16 }}
        rowClassName={() => 'custom-table-row'}
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
              {(selectedSectionId ? racks.filter(r => (typeof r.section === 'object' ? r.section._id : r.section) === selectedSectionId) : racks).map(r => (
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