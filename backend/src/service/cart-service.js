import { PrismaClient } from "@prisma/client";
import { validate } from "../validation/validation.js";
import { addToCartValidation } from "../validation/cart-validation.js";
const prisma = new PrismaClient();

const addToCart = async (request) => {
    const addToCartRequest = validate(addToCartValidation, request);
    const existingCartItem = await prisma.cart.findFirst({
        where: {
            userId: addToCartRequest.userId,
            productId: addToCartRequest.productId
        }
    })

    if (existingCartItem) {
        return await prisma.cart.update({
            where: {
                id: existingCartItem.id
            },
            data: {
                quantity: existingCartItem.quantity + addToCartRequest.quantity
            }
        })
    }

    return await prisma.cart.create({
        data: {
            userId: addToCartRequest.userId,
            productId: addToCartRequest.productId,
            quantity: addToCartRequest.quantity
        },
        include: {
            product: {
                select: {
                    name: true,
                    price: true,
                    imageUrl: true
                }
            }
        }
    })

}

export default {
    addToCart
}