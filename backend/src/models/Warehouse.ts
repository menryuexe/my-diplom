/**
 * @openapi
 * components:
 *   schemas:
 *     Warehouse:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         cells:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               product:
 *                 type: string
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface ICell {
  id: string;
  product: mongoose.Types.ObjectId | null;
}

export interface IWarehouse extends Document {
  name: string;
  description?: string;
  cells: ICell[];
  createdAt: Date;
  updatedAt: Date;
}

const cellSchema = new Schema<ICell>({
  id: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', default: null }
});

const warehouseSchema = new Schema<IWarehouse>({
  name: { type: String, required: true },
  description: { type: String },
  cells: [cellSchema]
}, { timestamps: true });

const Warehouse = mongoose.model<IWarehouse>('Warehouse', warehouseSchema);

export default Warehouse; 