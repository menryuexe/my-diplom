/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Получить список всех категорий
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Список категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     summary: Создать новую категорию
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Категория создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 * /api/categories/{id}:
 *   get:
 *     summary: Получить категорию по ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Категория
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *   put:
 *     summary: Обновить категорию по ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Категория обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *   delete:
 *     summary: Удалить категорию по ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Категория удалена
 */
import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import catchAsync from '../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(categoryController.getAllCategories));
router.get('/:id', catchAsync(categoryController.getCategoryById));
router.post('/', catchAsync(categoryController.createCategory));
router.put('/:id', catchAsync(categoryController.updateCategory));
router.delete('/:id', catchAsync(categoryController.deleteCategory));

export default router; 