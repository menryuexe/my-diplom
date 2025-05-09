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
const express_1 = require("express");
const warehouseController = __importStar(require("../controllers/warehouseController"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const router = (0, express_1.Router)();
router.get('/', (0, catchAsync_1.default)(warehouseController.getAllWarehouses));
router.get('/:id', (0, catchAsync_1.default)(warehouseController.getWarehouseById));
router.post('/', (0, catchAsync_1.default)(warehouseController.createWarehouse));
router.put('/:id', (0, catchAsync_1.default)(warehouseController.updateWarehouse));
router.delete('/:id', (0, catchAsync_1.default)(warehouseController.deleteWarehouse));
exports.default = router;
