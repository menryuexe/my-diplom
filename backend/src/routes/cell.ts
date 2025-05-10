/**
 * @openapi
 * /api/cells:
 *   get:
 *     summary: Получить список всех ячеек
 *     tags:
 *       - Cells
 *     responses:
 *       200:
 *         description: Список ячеек
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cell'
 *   post:
 *     summary: Создать новую ячейку
 *     tags:
 *       - Cells
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cell'
 *     responses:
 *       201:
 *         description: Ячейка создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cell'
 * /api/cells/{id}:
 *   get:
 *     summary: Получить ячейку по ID
 *     tags:
 *       - Cells
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ячейка
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cell'
 *   put:
 *     summary: Обновить ячейку по ID
 *     tags:
 *       - Cells
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
 *             $ref: '#/components/schemas/Cell'
 *     responses:
 *       200:
 *         description: Ячейка обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cell'
 *   delete:
 *     summary: Удалить ячейку по ID
 *     tags:
 *       - Cells
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ячейка удалена
 */
import { Router } from 'express';
import * as cellController from '../controllers/cellController';
import catchAsync from '../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(cellController.getAllCells));
router.get('/:id', catchAsync(cellController.getCellById));
router.post('/', catchAsync(cellController.createCell));
router.put('/:id', catchAsync(cellController.updateCell));
router.delete('/:id', catchAsync(cellController.deleteCell));

export default router; 