import snap from "../config/midtrans.js";
import { ResponseError } from "../error/response-error.js";
import { checkoutCartValidation, checkoutProductValidation } from "../validation/payment-validation.js"
import { validate } from "../validation/validation.js"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();
import moment from "moment-timezone";

const checkoutProduct = async (request) => {
    const checkoutProductRequest = validate(checkoutProductValidation, request);
    const product = await prisma.product.findFirst({
        where: {
            id: checkoutProductRequest.productId,
        }
    })

    if (!product) {
        throw new ResponseError(404, "Product not found");
    }
    if (product.stock < checkoutProductRequest.quantity) {
        throw new ResponseError(400, "Product stock is not enough");
    }

    const total = product.price * checkoutProductRequest.quantity;

    const order = await prisma.order.create({
        data: {
            userId: request.userId,
            total: total,
            status: 'PENDING',
            orderItems: {
                create: {
                    productId: product.id,
                    quantity: checkoutProductRequest.quantity,
                    Price: product.price
                }
            }
        },
        include: {
            orderItems: true
        }
    })

    const parameter = {
        transaction_details: {
            order_id: `ORDER-${order.id}-${Date.now()}`,
            gross_amount: total
        },
        item_details: [
            {
                id: product.id.toString(),
                price: product.price,
                quantity: checkoutProductRequest.quantity,
                name: product.name
            }
        ],
        expiry: {
            start_time: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss Z"),
            unit: "minutes",
            duration: 60
        }
    };

    const transaction = await snap.createTransaction(parameter);
    await prisma.payment.create({
        data: {
            orderId: order.id,
            grossAmount: total,
            transactionId: transaction.token,
        }
    })

    return { order, snap: transaction }
}

const checkoutCart = async (request) => {

    console.log("Request masuk checkoutCart:", request);
    const checkoutCartRequest = validate(checkoutCartValidation, request);

    if (!checkoutCartRequest.cartItemIds || checkoutCartRequest.cartItemIds.length === 0) {
        throw new ResponseError(400, "no cart items selected");
    }

    console.log("Hasil validasi checkoutCartRequest:", checkoutCartRequest);
    const cartItems = await prisma.cart.findMany({
        where: {
            userId: checkoutCartRequest.userId,
            id: { in: checkoutCartRequest.cartItemIds }
        },
        include: { product: true }
    });

    if (cartItems.length === 0) {
        throw new ResponseError(404, "Cart items not found");
    }

    let total = 0;
    for (const item of cartItems) {
        if (item.product.stock < item.quantity) {
            throw new ResponseError(
                400,
                `Stock for ${item.product.name} is not enough`
            );
        }
        total += item.product.price * item.quantity;
    }

    const order = await prisma.order.create({
        data: {
            userId: request.userId,
            total: total,
            status: "PENDING",
            orderItems: {
                create: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    Price: item.product.price
                }))
            }
        },
        include: { orderItems: true }
    });

    const parameter = {
        transaction_details: {
            order_id: `ORDER-${order.id}-${Date.now()}`,
            gross_amount: total
        },
        item_details: cartItems.map((item) => ({
            id: item.productId.toString(),
            price: item.product.price,
            quantity: item.quantity,
            name: item.product.name
        })),
        expiry: {
            start_time: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss Z"),
            unit: "minutes",
            duration: 60
        }
    };

    const transaction = await snap.createTransaction(parameter);

    await prisma.payment.create({
        data: {
            orderId: order.id,
            grossAmount: total,
            transactionId: transaction.token,
            status: "PENDING"
        }
    });

    await prisma.cart.deleteMany({
        where: {
            userId: request.userId,
            id: { in: checkoutCartRequest.cartItemIds }
        }
    });

    return { order, snap: transaction };
};

export default {
    checkoutProduct,
    checkoutCart
}