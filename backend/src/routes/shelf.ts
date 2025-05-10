/**
 * @openapi
 * /api/shelves:
 *   get:
 *     summary: Получить список всех полок
 *     tags:
 *       - Shelves
 *     responses:
 *       200:
 *         description: Список полок
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shelf'
 *   post:
 *     summary: Создать новую полку
 *     tags:
 *       - Shelves
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shelf'
 *     responses:
 *       201:
 *         description: Полка создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelf'
 * /api/shelves/{id}:
 *   get:
 *     summary: Получить полку по ID
 *     tags:
 *       - Shelves
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Полка
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelf'
 *   put:
 *     summary: Обновить полку по ID
 *     tags:
 *       - Shelves
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
 *             $ref: '#/components/schemas/Shelf'
 *     responses:
 *       200:
 *         description: Полка обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelf'
 *   delete:
 *     summary: Удалить полку по ID
 *     tags:
 *       - Shelves
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Полка удалена
 */
import { Router } from 'express';
import * as shelfController from '../controllers/shelfController';
import catchAsync from '../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(shelfController.getAllShelves));
router.get('/:id', catchAsync(shelfController.getShelfById));
router.post('/', catchAsync(shelfController.createShelf));
router.put('/:id', catchAsync(shelfController.updateShelf));
router.delete('/:id', catchAsync(shelfController.deleteShelf));

export default router; 