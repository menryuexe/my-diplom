/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Создать новый товар
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Товар создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags:
 *       - Products
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
 *     summary: Обновить товар по ID
 *     tags:
 *       - Products
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
 *         description: Товар обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *   delete:
 *     summary: Удалить товар по ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар удален
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