import { Request, Response, NextFunction } from 'express';
import cellService from '../services/cellService';

export const getAllCells = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cells = await cellService.getAll();
    res.json(cells);
  } catch (err) {
    next(err);
  }
};

export const getCellById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cell = await cellService.getById(req.params.id);
    if (!cell) return res.status(404).json({ message: 'Not found' });
    res.json(cell);
  } catch (err) {
    next(err);
  }
};

export const createCell = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cell = await cellService.create(req.body);
    res.status(201).json(cell);
  } catch (err) {
    next(err);
  }
};

export const updateCell = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cell = await cellService.update(req.params.id, req.body);
    if (!cell) return res.status(404).json({ message: 'Not found' });
    res.json(cell);
  } catch (err) {
    next(err);
  }
};

export const deleteCell = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cell = await cellService.remove(req.params.id);
    if (!cell) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}; 