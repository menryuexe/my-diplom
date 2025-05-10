/**
 * @openapi
 * /api/racks:
 *   get:
 *     summary: Получить список всех стеллажей
 *     tags:
 *       - Racks
 *     responses:
 *       200:
 *         description: Список стеллажей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rack'
 *   post:
 *     summary: Создать новый стеллаж
 *     tags:
 *       - Racks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rack'
 *     responses:
 *       201:
 *         description: Стеллаж создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rack'
 * /api/racks/{id}:
 *   get:
 *     summary: Получить стеллаж по ID
 *     tags:
 *       - Racks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Стеллаж
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rack'
 *   put:
 *     summary: Обновить стеллаж по ID
 *     tags:
 *       - Racks
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
 *         description: Стеллаж обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rack'
 *   delete:
 *     summary: Удалить стеллаж по ID
 *     tags:
 *       - Racks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Стеллаж удален
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