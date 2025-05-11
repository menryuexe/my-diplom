/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Отримати список усіх категорій
 *     description: |
 *       Категорія (category) — це тип товару, який використовується для групування товарів на складі.
 *     tags:
 *       - Категорії
 *     responses:
 *       200:
 *         description: Список категорій
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     summary: Додати нову категорію
 *     description: |
 *       Категорія (category) — це тип товару, який використовується для групування товарів на складі.
 *     tags:
 *       - Категорії
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Категорію додано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 * /api/categories/{id}:
 *   get:
 *     summary: Отримати категорію за ID
 *     description: |
 *       Категорія (category) — це тип товару, який використовується для групування товарів на складі.
 *     tags:
 *       - Категорії
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Категорія
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *   put:
 *     summary: Оновити категорію за ID
 *     description: |
 *       Категорія (category) — це тип товару, який використовується для групування товарів на складі.
 *     tags:
 *       - Категорії
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
 *         description: Категорію оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *   delete:
 *     summary: Видалити категорію за ID
 *     description: |
 *       Категорія (category) — це тип товару, який використовується для групування товарів на складі.
 *     tags:
 *       - Категорії
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Категорію видалено
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