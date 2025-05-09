import { Request, Response, NextFunction } from 'express';
import warehouseService from '../services/warehouseService';

export const getAllWarehouses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const warehouses = await warehouseService.getAll();
    res.json(warehouses);
  } catch (err) {
    next(err);
  }
};

export const getWarehouseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const warehouse = await warehouseService.getById(req.params.id);
    if (!warehouse) return res.status(404).json({ message: 'Not found' });
    res.json(warehouse);
  } catch (err) {
    next(err);
  }
};

export const createWarehouse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const warehouse = await warehouseService.create(req.body);
    res.status(201).json(warehouse);
  } catch (err) {
    next(err);
  }
};

export const updateWarehouse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const warehouse = await warehouseService.update(req.params.id, req.body);
    if (!warehouse) return res.status(404).json({ message: 'Not found' });
    res.json(warehouse);
  } catch (err) {
    next(err);
  }
};

export const deleteWarehouse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const warehouse = await warehouseService.remove(req.params.id);
    if (!warehouse) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}; 