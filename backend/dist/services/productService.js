"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = __importDefault(require("../models/Product"));
class ProductService {
    async getAll() {
        return Product_1.default.find().populate('category');
    }
    async getById(id) {
        return Product_1.default.findById(id).populate('category');
    }
    async create(data) {
        const product = new Product_1.default(data);
        return product.save();
    }
    async update(id, data) {
        return Product_1.default.findByIdAndUpdate(id, data, { new: true }).populate('category');
    }
    async remove(id) {
        return Product_1.default.findByIdAndDelete(id);
    }
}
exports.default = new ProductService();
