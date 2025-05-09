import Product, { IProduct } from '../models/Product';

class ProductService {
  async getAll(): Promise<IProduct[]> {
    return Product.find().populate('category');
  }

  async getById(id: string): Promise<IProduct | null> {
    return Product.findById(id).populate('category');
  }

  async create(data: Partial<IProduct>): Promise<IProduct> {
    const product = new Product(data);
    return product.save();
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, data, { new: true }).populate('category');
  }

  async remove(id: string): Promise<IProduct | null> {
    return Product.findByIdAndDelete(id);
  }
}

export default new ProductService(); 