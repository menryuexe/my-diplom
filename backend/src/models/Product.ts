/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       description: |
 *         Товар (product) — це об'єкт, який зберігається у комірці на складі.
 *       properties:
 *         name:
 *           type: string
 *           description: Назва товару
 *           example: "Ноутбук Lenovo"
 *         category:
 *           type: string
 *           description: ID категорії товару
 *           example: "60f7c2b8e1b1c2a1b8e1b1c2"
 *         barcode:
 *           type: string
 *           description: Штрихкод товару
 *           example: "1234567890123"
 *         rfid:
 *           type: string
 *           description: RFID-мітка товару
 *           example: "RFID123456"
 *         quantity:
 *           type: number
 *           description: Кількість одиниць товару
 *           example: 10
 *         description:
 *           type: string
 *           description: Опис товару
 *           example: "Потужний ноутбук для офісної роботи."
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  barcode: string;
  rfid: string;
  description?: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  barcode: { type: String, required: true },
  rfid: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true, default: 1 }
}, { timestamps: true });

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product; 