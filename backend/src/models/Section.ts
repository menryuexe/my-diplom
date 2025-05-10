import mongoose, { Schema, Document } from 'mongoose';

/**
 * @openapi
 * components:
 *   schemas:
 *     Section:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         warehouse:
 *           type: string
 */

export interface ISection extends Document {
  name: string;
  warehouse: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema = new Schema<ISection>({
  name: { type: String, required: true },
  warehouse: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true }
}, { timestamps: true });

const Section = mongoose.model<ISection>('Section', sectionSchema);

export default Section; 