import express from 'express';
import cartController from '../controller/cart-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';

const apiRouter = express.Router();

apiRouter.post('/addtocart', authMiddleware, cartController.addToCart)
apiRouter.get('/cart/:userId', authMiddleware, cartController.getCartUser)
apiRouter.put('/cart/:cartId', authMiddleware, cartController.updateCart)
apiRouter.delete('/cart/:cartId', authMiddleware, cartController.removeCart)

export { apiRouter };