/**
 * @openapi
 * components:
 *   schemas:
 *     Shelf:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         rack:
 *           type: string
 *         level:
 *           type: number
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IShelf extends Document {
  name: string;
  rack: mongoose.Types.ObjectId;
  level?: number;
  createdAt: Date;
  updatedAt: Date;
}

const shelfSchema = new Schema<IShelf>({
  name: { type: String, required: true },
  rack: { type: Schema.Types.ObjectId, ref: 'Rack', required: true },
  level: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

const Shelf = mongoose.model<IShelf>('Shelf', shelfSchema);

export default Shelf; 