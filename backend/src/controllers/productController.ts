import { Request, Response, NextFunction } from 'express';
import productService from '../services/productService';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.remove(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}; 