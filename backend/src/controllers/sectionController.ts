import { Request, Response, NextFunction } from 'express';
import sectionService from '../services/sectionService';

export const getAllSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sections = await sectionService.getAll();
    res.json(sections);
  } catch (err) {
    next(err);
  }
};

export const getSectionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await sectionService.getById(req.params.id);
    if (!section) return res.status(404).json({ message: 'Not found' });
    res.json(section);
  } catch (err) {
    next(err);
  }
};

export const createSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await sectionService.create(req.body);
    res.status(201).json(section);
  } catch (err) {
    next(err);
  }
};

export const updateSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await sectionService.update(req.params.id, req.body);
    if (!section) return res.status(404).json({ message: 'Not found' });
    res.json(section);
  } catch (err) {
    next(err);
  }
};

export const deleteSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await sectionService.remove(req.params.id);
    if (!section) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}; 