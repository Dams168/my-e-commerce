import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const notificationHandler = async (notification) => {
    const { order_id, transaction_status, fraud_status, gross_amount, transaction_id } = notification;

    const order = await prisma.order.findFirst({
        where: { id: parseInt(order_id.split("-")[1]) },
        include: { orderItems: true },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    let status = "PENDING";

    if (transaction_status === "settlement" && fraud_status === "accept") {
        status = "COMPLETED";

        for (const item of order.orderItems) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: { decrement: item.quantity },
                },
            });
        }

        await prisma.payment.updateMany({
            where: { orderId: order.id },
            data: {
                status: "SETTLEMENT",
                transactionId: transaction_id,
                paymentType: notification.payment_type,
                grossAmount: parseFloat(gross_amount),
            },
        });

    } else if (transaction_status === "expire") {
        status = "FAILED";

        await prisma.payment.updateMany({
            where: { orderId: order.id },
            data: {
                status: "EXPIRE",
            },
        });
    }

    await prisma.order.update({
        where: { id: order.id },
        data: { status },
    });

    return { message: "Notification handled", status };
}

export default { notificationHandler }