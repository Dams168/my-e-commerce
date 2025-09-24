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
        const userId = req.params.id;
        const result = await cartService.getCartUser({ userId });
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export default {
    addToCart,
    getCartUser
}