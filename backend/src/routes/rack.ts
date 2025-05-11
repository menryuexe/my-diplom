/**
 * @openapi
 * /api/racks:
 *   get:
 *     summary: Отримати список усіх стелажів
 *     description: |
 *       Стелаж (rack) — це фізичний стелаж у секції складу. Може містити декілька полиць.
 *     tags:
 *       - Стелажі
 *     responses:
 *       200:
 *         description: Список стелажів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rack'
 *   post:
 *     summary: Створити новий стелаж
 *     description: |
 *       Стелаж (rack) — це фізичний стелаж у секції складу. Може містити декілька полиць.
 *     tags:
 *       - Стелажі
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rack'
 *     responses:
 *       201:
 *         description: Стелаж створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rack'
 * /api/racks/{id}:
 *   get:
 *     summary: Отримати стелаж за ID
 *     description: |
 *       Стелаж (rack) — це фізичний стелаж у секції складу.
 *     tags:
 *       - Стелажі
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Стелаж
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rack'
 *   put:
 *     summary: Оновити стелаж за ID
 *     description: |
 *       Стелаж (rack) — це фізичний стелаж у секції складу.
 *     tags:
 *       - Стелажі
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
 *             $ref: '#/components/schemas/Rack'
 *     responses:
 *       200:
 *         description: Стелаж оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rack'
 *   delete:
 *     summary: Видалити стелаж за ID
 *     description: |
 *       Стелаж (rack) — це фізичний стелаж у секції складу.
 *     tags:
 *       - Стелажі
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Стелаж видалено
 */
import { Router } from 'express';
import * as rackController from '../controllers/rackController';
import catchAsync from '../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(rackController.getAllRacks));
router.get('/:id', catchAsync(rackController.getRackById));
router.post('/', catchAsync(rackController.createRack));
router.put('/:id', catchAsync(rackController.updateRack));
router.delete('/:id', catchAsync(rackController.deleteRack));

export default router; 