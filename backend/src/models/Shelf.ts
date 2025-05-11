/**
 * @openapi
 * components:
 *   schemas:
 *     Shelf:
 *       type: object
 *       description: |
 *         Полиця (shelf) — це фізична полиця на стелажі. Полиці створюються автоматично при створенні стелажа (користувач задає кількість).
 *       properties:
 *         name:
 *           type: string
 *           description: Назва полиці
 *           example: "Верхня полиця"
 *         rack:
 *           type: string
 *           description: ID стелажа, до якого належить полиця
 *           example: "60f7c2b8e1b1c2a1b8e1b1c2"
 *         level:
 *           type: number
 *           description: Рівень полиці (0 — найнижча)
 *           example: 0
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