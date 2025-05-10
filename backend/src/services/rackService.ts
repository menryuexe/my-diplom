import Rack, { IRack } from '../models/Rack';

class RackService {
  async getAll(): Promise<IRack[]> {
    return Rack.find().populate('section');
  }

  async getById(id: string): Promise<IRack | null> {
    return Rack.findById(id).populate('section');
  }

  async create(data: Partial<IRack>): Promise<IRack> {
    const rack = new Rack(data);
    return rack.save();
  }

  async update(id: string, data: Partial<IRack>): Promise<IRack | null> {
    return Rack.findByIdAndUpdate(id, data, { new: true }).populate('section');
  }

  async remove(id: string): Promise<IRack | null> {
    return Rack.findByIdAndDelete(id);
  }
}

export default new RackService(); 