"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Получить список всех категорий
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Список категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     summary: Создать новую категорию
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Категория создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 * /api/categories/{id}:
 *   get:
 *     summary: Получить категорию по ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Категория
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *   put:
 *     summary: Обновить категорию по ID
 *     tags:
 *       - Categories
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
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Категория обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *   delete:
 *     summary: Удалить категорию по ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Категория удалена
 */
const express_1 = require("express");
const categoryController = __importStar(require("../controllers/categoryController"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const router = (0, express_1.Router)();
router.get('/', (0, catchAsync_1.default)(categoryController.getAllCategories));
router.get('/:id', (0, catchAsync_1.default)(categoryController.getCategoryById));
router.post('/', (0, catchAsync_1.default)(categoryController.createCategory));
router.put('/:id', (0, catchAsync_1.default)(categoryController.updateCategory));
router.delete('/:id', (0, catchAsync_1.default)(categoryController.deleteCategory));
exports.default = router;
