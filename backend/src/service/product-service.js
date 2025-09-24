import { paging } from "../model/page.js"
import { validate } from "../validation/validation.js";
import { getAllProductValidation } from "../validation/product-validation.js";
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

export default {
    getAll
}