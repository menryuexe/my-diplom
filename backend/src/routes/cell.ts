/**
 * @openapi
 * /api/cells:
 *   get:
 *     summary: Отримати список усіх створених вручну комірок (cell)
 *     description: |
 *       Комірка (cell) — це не кожна полиця, а лише створена вручну комірка (місце для товару на полиці).
 *       Комірки створюються вручну через форму або при додаванні товару на полицю.
 *     tags:
 *       - Комірки
 *     responses:
 *       200:
 *         description: Список комірок
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cell'
 *   post:
 *     summary: Створити нову комірку (cell) вручну
 *     description: |
 *       Комірка (cell) — це не кожна полиця, а лише створена вручну комірка (місце для товару на полиці).
 *       Комірки створюються вручну через форму або при додаванні товару на полицю.
 *     tags:
 *       - Комірки
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cell'
 *     responses:
 *       201:
 *         description: Комірка створена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cell'
 * /api/cells/{id}:
 *   get:
 *     summary: Отримати комірку (cell) за ID
 *     description: |
 *       Комірка (cell) — це не кожна полиця, а лише створена вручну комірка (місце для товару на полиці).
 *     tags:
 *       - Комірки
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Комірка
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cell'
 *   put:
 *     summary: Оновити комірку (cell) за ID
 *     description: |
 *       Комірка (cell) — це не кожна полиця, а лише створена вручну комірка (місце для товару на полиці).
 *     tags:
 *       - Комірки
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
 *         description: Комірка оновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cell'
 *   delete:
 *     summary: Видалити комірку (cell) за ID
 *     description: |
 *       Комірка (cell) — це не кожна полиця, а лише створена вручну комірка (місце для товару на полиці).
 *     tags:
 *       - Комірки
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Комірка видалена
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