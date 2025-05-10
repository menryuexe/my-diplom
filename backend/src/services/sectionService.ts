import Section, { ISection } from '../models/Section';

class SectionService {
  async getAll(): Promise<ISection[]> {
    return Section.find().populate('warehouse');
  }

  async getById(id: string): Promise<ISection | null> {
    return Section.findById(id).populate('warehouse');
  }

  async create(data: Partial<ISection>): Promise<ISection> {
    const section = new Section(data);
    return section.save();
  }

  async update(id: string, data: Partial<ISection>): Promise<ISection | null> {
    return Section.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id: string): Promise<ISection | null> {
    return Section.findByIdAndDelete(id);
  }
}

export default new SectionService(); 