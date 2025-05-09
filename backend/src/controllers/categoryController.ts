import { Request, Response, NextFunction } from 'express';
import categoryService from '../services/categoryService';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAll();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.update(req.params.id, req.body);
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.remove(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}; 