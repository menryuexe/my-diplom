import { Request, Response, NextFunction } from 'express';
import shelfService from '../services/shelfService';

export const getAllShelves = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shelves = await shelfService.getAll();
    res.json(shelves);
  } catch (err) {
    next(err);
  }
};

export const getShelfById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shelf = await shelfService.getById(req.params.id);
    if (!shelf) return res.status(404).json({ message: 'Not found' });
    res.json(shelf);
  } catch (err) {
    next(err);
  }
};

export const createShelf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shelf = await shelfService.create(req.body);
    res.status(201).json(shelf);
  } catch (err) {
    next(err);
  }
};

export const updateShelf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shelf = await shelfService.update(req.params.id, req.body);
    if (!shelf) return res.status(404).json({ message: 'Not found' });
    res.json(shelf);
  } catch (err) {
    next(err);
  }
};

export const deleteShelf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shelf = await shelfService.remove(req.params.id);
    if (!shelf) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}; 