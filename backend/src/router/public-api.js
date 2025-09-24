import express from 'express';
import productController from '../controller/product-controller.js';
import userController from '../controller/user-controller.js';

const publicRouter = express.Router();

// product
publicRouter.get('/products', productController.getAllProducts);
publicRouter.get('/product/:id', productController.getProductById);

//Auth
publicRouter.post('/register', userController.register)
publicRouter.post('/login', userController.login)


publicRouter.get('/', (req, res) => {
    res.send('Hello World!');
});

export { publicRouter };