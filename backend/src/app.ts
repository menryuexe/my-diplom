import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import warehouseRoutes from './routes/warehouse';
import productRoutes from './routes/product';
import categoryRoutes from './routes/category';
import errorHandler from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/warehouses', warehouseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app; 