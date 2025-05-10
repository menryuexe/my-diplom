/**
 * @openapi
 * components:
 *   schemas:
 *     Cell:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         shelf:
 *           type: string
 *         product:
 *           type: string
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