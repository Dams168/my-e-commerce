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

const getProductById = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const result = await productService.getById(productId);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export default {
    getAllProducts,
    getProductById
}