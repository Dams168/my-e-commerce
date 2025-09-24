import express from 'express';
import cartController from '../controller/cart-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';

const apiRouter = express.Router();

apiRouter.post('/addtocart', authMiddleware, cartController.addToCart)
apiRouter.get('/cart/:id', authMiddleware, cartController.getCartUser)

export { apiRouter };