import mongoose from 'mongoose';
import Shelf from '../models/Shelf';
import dotenv from 'dotenv';

dotenv.config();

const updateShelves = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/warehouse');
    console.log('Connected to MongoDB');

    // Получаем все полки
    const shelves = await Shelf.find({});
    console.log(`Found ${shelves.length} shelves`);

    // Обновляем каждую полку
    for (const shelf of shelves) {
      // Если уровень не установлен, устанавливаем его в 0
      if (shelf.level === undefined) {
        await Shelf.findByIdAndUpdate(shelf._id, { level: 0 });
        console.log(`Updated shelf ${shelf.name} with level 0`);
      }
    }

    console.log('All shelves updated successfully');
  } catch (error) {
    console.error('Error updating shelves:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

updateShelves(); 