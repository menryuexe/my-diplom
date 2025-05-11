/**
 * @openapi
 * /api/sections:
 *   get:
 *     summary: Отримати список усіх секцій
 *     description: |
 *       Секція (section) — це логічна зона складу, яка містить стелажі.
 *     tags:
 *       - Секції
 *     responses:
 *       200:
 *         description: Список секцій
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Section'
 *   post:
 *     summary: Створити нову секцію
 *     description: |
 *       Секція (section) — це логічна зона складу, яка містить стелажі.
 *     tags:
 *       - Секції
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Section'
 *     responses:
 *       201:
 *         description: Секція створена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Section'
 * /api/sections/{id}:
 *   get:
 *     summary: Отримати секцію за ID
 *     description: |
 *       Секція (section) — це логічна зона складу.
 *     tags:
 *       - Секції
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Секція
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Section'
 *   put:
 *     summary: Оновити секцію за ID
 *     description: |
 *       Секція (section) — це логічна зона складу.
 *     tags:
 *       - Секції
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
 *             $ref: '#/components/schemas/Section'
 *     responses:
 *       200:
 *         description: Секція оновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Section'
 *   delete:
 *     summary: Видалити секцію за ID
 *     description: |
 *       Секція (section) — це логічна зона складу.
 *     tags:
 *       - Секції
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Секція видалена
 */
import { Router } from 'express';
import * as sectionController from '../controllers/sectionController';
import catchAsync from '../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(sectionController.getAllSections));
router.get('/:id', catchAsync(sectionController.getSectionById));
router.post('/', catchAsync(sectionController.createSection));
router.put('/:id', catchAsync(sectionController.updateSection));
router.delete('/:id', catchAsync(sectionController.deleteSection));

export default router; 