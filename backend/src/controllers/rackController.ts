import { Request, Response, NextFunction } from 'express';
import rackService from '../services/rackService';

export const getAllRacks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const racks = await rackService.getAll();
    res.json(racks);
  } catch (err) {
    next(err);
  }
};

export const getRackById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rack = await rackService.getById(req.params.id);
    if (!rack) return res.status(404).json({ message: 'Not found' });
    res.json(rack);
  } catch (err) {
    next(err);
  }
};

export const createRack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rack = await rackService.create(req.body);
    res.status(201).json(rack);
  } catch (err) {
    next(err);
  }
};

export const updateRack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rack = await rackService.update(req.params.id, req.body);
    if (!rack) return res.status(404).json({ message: 'Not found' });
    res.json(rack);
  } catch (err) {
    next(err);
  }
};

export const deleteRack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rack = await rackService.remove(req.params.id);
    if (!rack) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}; 