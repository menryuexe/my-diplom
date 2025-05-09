"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Warehouse_1 = __importDefault(require("../models/Warehouse"));
class WarehouseService {
    async getAll() {
        return Warehouse_1.default.find();
    }
    async getById(id) {
        return Warehouse_1.default.findById(id);
    }
    async create(data) {
        const warehouse = new Warehouse_1.default(data);
        return warehouse.save();
    }
    async update(id, data) {
        return Warehouse_1.default.findByIdAndUpdate(id, data, { new: true });
    }
    async remove(id) {
        return Warehouse_1.default.findByIdAndDelete(id);
    }
}
exports.default = new WarehouseService();
