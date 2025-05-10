import Shelf, { IShelf } from '../models/Shelf';

class ShelfService {
  async getAll(): Promise<IShelf[]> {
    return Shelf.find().populate({
      path: 'rack',
      populate: {
        path: 'section'
      }
    });
  }

  async getById(id: string): Promise<IShelf | null> {
    return Shelf.findById(id).populate({
      path: 'rack',
      populate: {
        path: 'section'
      }
    });
  }

  async create(data: Partial<IShelf>): Promise<IShelf> {
    const shelf = new Shelf(data);
    return shelf.save();
  }

  async update(id: string, data: Partial<IShelf>): Promise<IShelf | null> {
    return Shelf.findByIdAndUpdate(id, data, { new: true }).populate({
      path: 'rack',
      populate: {
        path: 'section'
      }
    });
  }

  async remove(id: string): Promise<IShelf | null> {
    return Shelf.findByIdAndDelete(id);
  }
}

export default new ShelfService(); 