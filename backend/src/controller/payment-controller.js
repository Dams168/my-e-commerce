import paymentService from "../service/payment-service.js";

const checkoutProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const quantity = req.body.quantity;
        const result = await paymentService.checkoutProduct({
            productId,
            quantity,
            userId: req.user.id
        });
        res.status(201).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export default {
    checkoutProduct
}