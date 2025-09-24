import { paging } from "../model/page.js"
import { validate } from "../validation/validation.js";
import { getAllProductValidation, getProductByIdValidation } from "../validation/product-validation.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getAll = async (request) => {
    const getAllRequest = validate(getAllProductValidation, request)
    const skip = (getAllRequest.page - 1) * getAllRequest.limit;

    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
        },
        skip: skip,
        take: getAllRequest.limit
    })

    const total = await prisma.product.count();

    return {
        data: products,
        paging: {
            page: getAllRequest.page,
            limit: getAllRequest.limit,
            total: total
        }
    }
}

const getById = async (productId) => {
    const getByIdRequest = validate(getProductByIdValidation, { id: productId });
    const product = await prisma.product.findFirst({
        where: {
            id: getByIdRequest.id
        },
        select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            description: true,
            category: {
                select: {
                    id: true,
                    name: true
                }
            },
            reviews: {
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        }
    })

    if (!product) {
        throw new ResponseError(404, 'Product not found');
    }

    return product;
}

export default {
    getAll,
    getById
}