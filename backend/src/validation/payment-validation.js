import Joi from "joi";

export const checkoutProductValidation = Joi.object({
    productId: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).required(),
    userId: Joi.number().integer().optional()
});

export const checkoutCartValidation = Joi.object({
    cartItemIds: Joi.array().items(Joi.number().integer()).required(),
    userId: Joi.number().integer().optional()
})