/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
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