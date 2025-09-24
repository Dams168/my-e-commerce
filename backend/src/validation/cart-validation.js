import Joi from "joi";

export const addToCartValidation = Joi.object({
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().positive().required(),
    userId: Joi.number().integer().positive().required()
})

export const getCartValidation = Joi.object({
    userId: Joi.number().integer().positive().required()
})