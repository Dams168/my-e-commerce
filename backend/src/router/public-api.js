import express from 'express';
import productController from '../controller/product-controller.js';

const publicRouter = express.Router();

publicRouter.get('/products', productController.getAllProducts);
publicRouter.get('/product/:id', productController.getProductById);

publicRouter.get('/', (req, res) => {
    res.send('Hello World!');
});

export { publicRouter };