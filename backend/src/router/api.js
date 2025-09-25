import express from 'express';
import cartController from '../controller/cart-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import midtransController from '../controller/midtrans-controller.js';
import paymentController from '../controller/payment-controller.js';

const apiRouter = express.Router();

// Cart routes
apiRouter.post('/addtocart', authMiddleware, cartController.addToCart)
apiRouter.get('/cart/:userId', authMiddleware, cartController.getCartUser)
apiRouter.put('/cart/:cartId', authMiddleware, cartController.updateCart)
apiRouter.delete('/cart/:cartId', authMiddleware, cartController.removeCart)

// Payment routes
apiRouter.post('/checkout/cart', authMiddleware, paymentController.checkoutCart)
apiRouter.post('/checkout/:productId', authMiddleware, paymentController.checkoutProduct)


//midtrans notification
apiRouter.post('/midtrans/notification', midtransController.midtransNotification)

export { apiRouter };