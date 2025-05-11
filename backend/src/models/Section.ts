import mongoose, { Schema, Document } from 'mongoose';

/**
 * @openapi
 * components:
 *   schemas:
 *     Section:
 *       type: object
 *       description: |
 *         Секція (section) — це логічна зона складу, яка містить стелажі.
 *       properties:
 *         name:
 *           type: string
 *           description: Назва секції
 *           example: "Секція A"
 *         warehouse:
 *           type: string
 *           description: ID складу, до якого належить секція
 *           example: "60f7c2b8e1b1c2a1b8e1b1c2"
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