/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       description: |
 *         Категорія (category) — це тип товару, який використовується для групування товарів на складі.
 *       properties:
 *         name:
 *           type: string
 *           description: Назва категорії
 *           example: "Електроніка"
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true }
}, { timestamps: true });

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category; 