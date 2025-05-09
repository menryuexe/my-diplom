"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Server error' });
};
