/**
 * @openapi
 * components:
 *   schemas:
 *     Rack:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         section:
 *           type: string
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