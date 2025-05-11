/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Отримати список усіх товарів
 *     description: |
 *       Товар (product) — це об'єкт, який зберігається у комірці на складі.
 *     tags:
 *       - Товари
 *     responses:
 *       200:
 *         description: Список товарів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Додати новий товар
 *     description: |
 *       Товар (product) — це об'єкт, який зберігається у комірці на складі.
 *     tags:
 *       - Товари
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Товар додано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 * /api/products/{id}:
 *   get:
 *     summary: Отримати товар за ID
 *     description: |
 *       Товар (product) — це об'єкт, який зберігається у комірці на складі.
 *     tags:
 *       - Товари
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *   put:
 *     summary: Оновити товар за ID
 *     description: |
 *       Товар (product) — це об'єкт, який зберігається у комірці на складі.
 *     tags:
 *       - Товари
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Товар оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *   delete:
 *     summary: Видалити товар за ID
 *     description: |
 *       Товар (product) — це об'єкт, який зберігається у комірці на складі.
 *     tags:
 *       - Товари
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар видалено
 */
import { Router } from 'express';
import * as productController from '../controllers/productController';
import catchAsync from '../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(productController.getAllProducts));
router.get('/:id', catchAsync(productController.getProductById));
router.post('/', catchAsync(productController.createProduct));
router.put('/:id', catchAsync(productController.updateProduct));
router.delete('/:id', catchAsync(productController.deleteProduct));

export default router; 