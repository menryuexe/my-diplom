"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWarehouse = exports.updateWarehouse = exports.createWarehouse = exports.getWarehouseById = exports.getAllWarehouses = void 0;
const warehouseService_1 = __importDefault(require("../services/warehouseService"));
const getAllWarehouses = async (req, res, next) => {
    try {
        const warehouses = await warehouseService_1.default.getAll();
        res.json(warehouses);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllWarehouses = getAllWarehouses;
const getWarehouseById = async (req, res, next) => {
    try {
        const warehouse = await warehouseService_1.default.getById(req.params.id);
        if (!warehouse)
            return res.status(404).json({ message: 'Not found' });
        res.json(warehouse);
    }
    catch (err) {
        next(err);
    }
};
exports.getWarehouseById = getWarehouseById;
const createWarehouse = async (req, res, next) => {
    try {
        const warehouse = await warehouseService_1.default.create(req.body);
        res.status(201).json(warehouse);
    }
    catch (err) {
        next(err);
    }
};
exports.createWarehouse = createWarehouse;
const updateWarehouse = async (req, res, next) => {
    try {
        const warehouse = await warehouseService_1.default.update(req.params.id, req.body);
        if (!warehouse)
            return res.status(404).json({ message: 'Not found' });
        res.json(warehouse);
    }
    catch (err) {
        next(err);
    }
};
exports.updateWarehouse = updateWarehouse;
const deleteWarehouse = async (req, res, next) => {
    try {
        const warehouse = await warehouseService_1.default.remove(req.params.id);
        if (!warehouse)
            return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteWarehouse = deleteWarehouse;
