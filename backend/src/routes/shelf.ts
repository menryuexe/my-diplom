/**
 * @openapi
 * /api/shelves:
 *   get:
 *     summary: Отримати список усіх полиць
 *     description: |
 *       Полиця (shelf) — це фізична полиця на стелажі. Полиці створюються автоматично при створенні стелажа (користувач задає кількість).
 *     tags:
 *       - Полиці
 *     responses:
 *       200:
 *         description: Список полиць
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shelf'
 *   post:
 *     summary: Створити нову полицю
 *     description: |
 *       Полиця (shelf) — це фізична полиця на стелажі. Полиці створюються автоматично при створенні стелажа (користувач задає кількість).
 *     tags:
 *       - Полиці
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shelf'
 *     responses:
 *       201:
 *         description: Полиця створена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelf'
 * /api/shelves/{id}:
 *   get:
 *     summary: Отримати полицю за ID
 *     description: |
 *       Полиця (shelf) — це фізична полиця на стелажі.
 *     tags:
 *       - Полиці
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Полиця
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelf'
 *   put:
 *     summary: Оновити полицю за ID
 *     description: |
 *       Полиця (shelf) — це фізична полиця на стелажі.
 *     tags:
 *       - Полиці
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
 *         description: Полиця оновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelf'
 *   delete:
 *     summary: Видалити полицю за ID
 *     description: |
 *       Полиця (shelf) — це фізична полиця на стелажі.
 *     tags:
 *       - Полиці
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Полиця видалена
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