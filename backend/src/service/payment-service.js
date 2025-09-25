import snap from "../config/midtrans.js";
import { ResponseError } from "../error/response-error.js";
import { checkoutProductValidation } from "../validation/payment-validation.js"
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

export default {
    checkoutProduct
}