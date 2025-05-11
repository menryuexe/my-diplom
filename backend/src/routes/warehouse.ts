/**
 * @openapi
 * /api/warehouses:
 *   get:
 *     summary: Отримати список усіх складів
 *     description: |
 *       Склад (warehouse) — це фізичний склад, який містить секції.
 *     tags:
 *       - Склади
 *     responses:
 *       200:
 *         description: Список складів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Warehouse'
 *   post:
 *     summary: Створити новий склад
 *     description: |
 *       Склад (warehouse) — це фізичний склад, який містить секції.
 *     tags:
 *       - Склади
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Warehouse'
 *     responses:
 *       201:
 *         description: Склад створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
 * /api/warehouses/{id}:
 *   get:
 *     summary: Отримати склад за ID
 *     description: |
 *       Склад (warehouse) — це фізичний склад.
 *     tags:
 *       - Склади
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Склад
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
 *   put:
 *     summary: Оновити склад за ID
 *     description: |
 *       Склад (warehouse) — це фізичний склад.
 *     tags:
 *       - Склади
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
 *             $ref: '#/components/schemas/Warehouse'
 *     responses:
 *       200:
 *         description: Склад оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
 *   delete:
 *     summary: Видалити склад за ID
 *     description: |
 *       Склад (warehouse) — це фізичний склад.
 *     tags:
 *       - Склади
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Склад видалено
 */
import { Router } from 'express';
import * as warehouseController from '../controllers/warehouseController';
import catchAsync from '../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(warehouseController.getAllWarehouses));
router.get('/:id', catchAsync(warehouseController.getWarehouseById));
router.post('/', catchAsync(warehouseController.createWarehouse));
router.put('/:id', catchAsync(warehouseController.updateWarehouse));
router.delete('/:id', catchAsync(warehouseController.deleteWarehouse));

export default router; 