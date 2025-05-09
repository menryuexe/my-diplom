/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         barcode:
 *           type: string
 *         rfid:
 *           type: string
 *         description:
 *           type: string
 *         quantity:
 *           type: integer
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