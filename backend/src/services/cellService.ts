import Cell, { ICell } from '../models/Cell';

class CellService {
  async getAll(): Promise<ICell[]> {
    return Cell.find().populate({
      path: 'shelf',
      populate: {
        path: 'rack',
        populate: {
          path: 'section'
        }
      }
    }).populate('product');
  }

  async getById(id: string): Promise<ICell | null> {
    return Cell.findById(id).populate({
      path: 'shelf',
      populate: {
        path: 'rack',
        populate: {
          path: 'section'
        }
      }
    }).populate('product');
  }

  async create(data: Partial<ICell>): Promise<ICell> {
    const cell = new Cell(data);
    return cell.save();
  }

  async update(id: string, data: Partial<ICell>): Promise<ICell | null> {
    return Cell.findByIdAndUpdate(id, data, { new: true }).populate({
      path: 'shelf',
      populate: {
        path: 'rack',
        populate: {
          path: 'section'
        }
      }
    }).populate('product');
  }

  async remove(id: string): Promise<ICell | null> {
    return Cell.findByIdAndDelete(id);
  }
}

export default new CellService(); 