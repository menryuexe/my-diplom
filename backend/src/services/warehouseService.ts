import Warehouse, { IWarehouse } from '../models/Warehouse';

class WarehouseService {
  async getAll(): Promise<IWarehouse[]> {
    return Warehouse.find();
  }

  async getById(id: string): Promise<IWarehouse | null> {
    return Warehouse.findById(id);
  }

  async create(data: Partial<IWarehouse>): Promise<IWarehouse> {
    const warehouse = new Warehouse(data);
    return warehouse.save();
  }

  async update(id: string, data: Partial<IWarehouse>): Promise<IWarehouse | null> {
    return Warehouse.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id: string): Promise<IWarehouse | null> {
    return Warehouse.findByIdAndDelete(id);
  }
}

export default new WarehouseService(); 