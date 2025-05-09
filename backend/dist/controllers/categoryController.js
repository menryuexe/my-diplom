"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const categoryService_1 = __importDefault(require("../services/categoryService"));
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await categoryService_1.default.getAll();
        res.json(categories);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (req, res, next) => {
    try {
        const category = await categoryService_1.default.getById(req.params.id);
        if (!category)
            return res.status(404).json({ message: 'Not found' });
        res.json(category);
    }
    catch (err) {
        next(err);
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res, next) => {
    try {
        const category = await categoryService_1.default.create(req.body);
        res.status(201).json(category);
    }
    catch (err) {
        next(err);
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res, next) => {
    try {
        const category = await categoryService_1.default.update(req.params.id, req.body);
        if (!category)
            return res.status(404).json({ message: 'Not found' });
        res.json(category);
    }
    catch (err) {
        next(err);
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    try {
        const category = await categoryService_1.default.remove(req.params.id);
        if (!category)
            return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteCategory = deleteCategory;
