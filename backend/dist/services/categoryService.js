"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../models/Category"));
class CategoryService {
    async getAll() {
        return Category_1.default.find();
    }
    async getById(id) {
        return Category_1.default.findById(id);
    }
    async create(data) {
        const category = new Category_1.default(data);
        return category.save();
    }
    async update(id, data) {
        return Category_1.default.findByIdAndUpdate(id, data, { new: true });
    }
    async remove(id) {
        return Category_1.default.findByIdAndDelete(id);
    }
}
exports.default = new CategoryService();
