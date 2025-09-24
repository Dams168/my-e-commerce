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

export default { addToCart }