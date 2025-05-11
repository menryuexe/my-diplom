/**
 * @openapi
 * components:
 *   schemas:
 *     Rack:
 *       type: object
 *       description: |
 *         Стелаж (rack) — це фізичний стелаж у секції складу. Може містити декілька полиць.
 *       properties:
 *         name:
 *           type: string
 *           description: Назва стелажа
 *           example: "Стелаж №1"
 *         section:
 *           type: string
 *           description: ID секції, до якої належить стелаж
 *           example: "60f7c2b8e1b1c2a1b8e1b1c2"
 *         position:
 *           type: object
 *           properties:
 *             x:
 *               type: number
 *             y:
 *               type: number
 *             z:
 *               type: number
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IRack extends Document {
  name: string;
  section: mongoose.Types.ObjectId;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const rackSchema = new Schema<IRack>({
  name: { type: String, required: true },
  section: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  }
}, { timestamps: true });

const Rack = mongoose.model<IRack>('Rack', rackSchema);

export default Rack; 