import productService from '../service/product-service.js';

const getAllProducts = async (req, res, next) => {
    try {
        const request = {
            page: req.query.page || 1,
            limit: req.query.limit || 10
        };
        const result = await productService.getAll(request);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}

export default {
    getAllProducts
}