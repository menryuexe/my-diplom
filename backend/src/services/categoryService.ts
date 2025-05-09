import Category, { ICategory } from '../models/Category';

class CategoryService {
  async getAll(): Promise<ICategory[]> {
    return Category.find();
  }

  async getById(id: string): Promise<ICategory | null> {
    return Category.findById(id);
  }

  async create(data: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(data);
    return category.save();
  }

  async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return Category.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id: string): Promise<ICategory | null> {
    return Category.findByIdAndDelete(id);
  }
}

export default new CategoryService(); 