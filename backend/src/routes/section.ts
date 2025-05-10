/**
 * @openapi
 * /api/sections:
 *   get:
 *     summary: Получить список всех секций
 *     tags:
 *       - Sections
 *     responses:
 *       200:
 *         description: Список секций
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Section'
 *   post:
 *     summary: Создать новую секцию
 *     tags:
 *       - Sections
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Section'
 *     responses:
 *       201:
 *         description: Секция создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Section'
 * /api/sections/{id}:
 *   get:
 *     summary: Получить секцию по ID
 *     tags:
 *       - Sections
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Секция
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Section'
 *   put:
 *     summary: Обновить секцию по ID
 *     tags:
 *       - Sections
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
 *         description: Секция обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Section'
 *   delete:
 *     summary: Удалить секцию по ID
 *     tags:
 *       - Sections
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Секция удалена
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