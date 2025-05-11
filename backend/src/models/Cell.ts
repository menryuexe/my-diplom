/**
 * @openapi
 * components:
 *   schemas:
 *     Cell:
 *       type: object
 *       description: |
 *         Комірка (cell) — це не кожна полиця, а лише створена вручну комірка (місце для товару на полиці). 
 *         Комірки створюються вручну через форму або при додаванні товару на полицю. 
 *         Кількість комірок на складі не дорівнює кількості полиць!
 *       properties:
 *         name:
 *           type: string
 *           description: Назва комірки
 *         shelf:
 *           type: string
 *           description: ID полиці, до якої належить комірка
 *         product:
 *           type: string
 *           description: ID товару, який знаходиться у комірці (або null)
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface ICell extends Document {
  name: string;
  shelf: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const cellSchema = new Schema<ICell>({
  name: { type: String, required: true },
  shelf: { type: Schema.Types.ObjectId, ref: 'Shelf', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', default: null }
}, { timestamps: true });

const Cell = mongoose.model<ICell>('Cell', cellSchema);

export default Cell; 