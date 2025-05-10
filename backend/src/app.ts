import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import warehouseRoutes from './routes/warehouse';
import productRoutes from './routes/product';
import categoryRoutes from './routes/category';
import errorHandler from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import sectionRoutes from './routes/section';
import rackRoutes from './routes/rack';
import shelfRoutes from './routes/shelf';
import cellRoutes from './routes/cell';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/warehouses', warehouseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/racks', rackRoutes);
app.use('/api/shelves', shelfRoutes);
app.use('/api/cells', cellRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app; 