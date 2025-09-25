import { PrismaClient } from "@prisma/client";
import { validate } from "../validation/validation.js";
import { addToCartValidation, getCartValidation, removeCartValidation, updateCartValidation } from "../validation/cart-validation.js";
import { ResponseError } from "../error/response-error.js";
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

const getCartUser = async (request) => {
    const getCartRequest = validate(getCartValidation, request);

    const cart = await prisma.cart.findMany({
        orderBy: {
            id: 'asc'
        },
        where: {
            id: getCartRequest.id
        },
        select: {
            id: true,
            quantity: true,
            product: {
                select: {
                    name: true,
                    price: true,
                    imageUrl: true,
                }
            }
        }
    })
    if (!cart) {
        throw new ResponseError(404, 'Cart not found');
    }
    return cart;
}

const updateCart = async (request) => {
    const updateCartRequest = validate(updateCartValidation, request);

    const existingCartItem = await prisma.cart.findUnique({
        where: {
            id: updateCartRequest.cartId
        }
    })

    if (!existingCartItem) {
        throw new ResponseError(404, 'Cart item not found');
    }

    const updateCart = await prisma.cart.update({
        where: {
            id: updateCartRequest.cartId
        },
        data: {
            quantity: updateCartRequest.quantity
        }
    })

    return updateCart;
}

const removeCart = async (request) => {
    const removeCartRequest = validate(removeCartValidation, request);

    const existingCartItem = await prisma.cart.findUnique({
        where: {
            id: removeCartRequest.cartId
        }
    })

    if (!existingCartItem) {
        throw new ResponseError(404, 'Cart item not found');
    }

    await prisma.cart.delete({
        where: {
            id: removeCartRequest.cartId
        }
    })
    return ({
        message: 'Cart item removed successfully'
    })
}

export default {
    addToCart,
    getCartUser,
    updateCart,
    removeCart
}