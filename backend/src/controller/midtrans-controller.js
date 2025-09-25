import notificationHandler from "../service/midtrans-service.js";

const midtransNotification = async (req, res, next) => {
    try {
        console.log("📩 Midtrans Notification Received:", req.body);
        const notification = req.body;
        const result = await notificationHandler.notificationHandler(notification);
        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error handling Midtrans notification:", error);
        next(error);
    }
}

export default {
    midtransNotification
}