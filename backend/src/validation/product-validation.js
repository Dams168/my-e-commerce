import Joi from 'joi';

export const getAllProductValidation = Joi.object({
    page: Joi.number().integer().positive(),
    limit: Joi.number().integer().positive()
})