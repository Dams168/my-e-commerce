import cartService from "../service/cart-service.js";

const addToCart = async (req, res, next) => {
    try {
        const result = await cartService.addToCart(req.body);
        res.status(201).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const getCartUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const result = await cartService.getCartUser({ userId });
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const updateCart = async (req, res, next) => {
    try {
        const cartId = req.params.cartId;
        const quantity = req.body.quantity;
        const result = await cartService.updateCart({ cartId, quantity });
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const removeCart = async (req, res, next) => {
    try {
        const cartId = req.params.cartId;
        const result = await cartService.removeCart({ cartId });
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export default {
    addToCart,
    getCartUser,
    updateCart,
    removeCart
}