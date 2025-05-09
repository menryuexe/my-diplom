/**
 * @openapi
 * /api/warehouses:
 *   get:
 *     summary: Получить список всех складов
 *     tags:
 *       - Warehouses
 *     responses:
 *       200:
 *         description: Список складов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Warehouse'
 *   post:
 *     summary: Создать новый склад
 *     tags:
 *       - Warehouses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Warehouse'
 *     responses:
 *       201:
 *         description: Склад создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
 * /api/warehouses/{id}:
 *   get:
 *     summary: Получить склад по ID
 *     tags:
 *       - Warehouses
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
 *     summary: Обновить склад по ID
 *     tags:
 *       - Warehouses
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
 *         description: Склад обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
 *   delete:
 *     summary: Удалить склад по ID
 *     tags:
 *       - Warehouses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Склад удален
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