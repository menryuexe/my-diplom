"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const productService_1 = __importDefault(require("../services/productService"));
const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService_1.default.getAll();
        res.json(products);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res, next) => {
    try {
        const product = await productService_1.default.getById(req.params.id);
        if (!product)
            return res.status(404).json({ message: 'Not found' });
        res.json(product);
    }
    catch (err) {
        next(err);
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res, next) => {
    try {
        const product = await productService_1.default.create(req.body);
        res.status(201).json(product);
    }
    catch (err) {
        next(err);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const product = await productService_1.default.update(req.params.id, req.body);
        if (!product)
            return res.status(404).json({ message: 'Not found' });
        res.json(product);
    }
    catch (err) {
        next(err);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const product = await productService_1.default.remove(req.params.id);
        if (!product)
            return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteProduct = deleteProduct;
