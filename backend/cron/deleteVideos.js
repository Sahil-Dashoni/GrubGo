import cron from "node-cron";
import Order from "../models/order.model.js";
import { v2 as cloudinary } from "cloudinary";

cron.schedule("*/1 * * * *", async () => {
    try {
        const now = new Date();

        const orders = await Order.find({
            "shopOrders.videoExpiresAt": { $lte: now }
        });

        for (let order of orders) {
            let updated = false;

            for (let shopOrder of order.shopOrders) {
                if (
                    shopOrder.videoUrl &&
                    shopOrder.videoExpiresAt &&
                    shopOrder.videoExpiresAt <= now
                ) {
                    // DELETE FROM CLOUDINARY
                    if (shopOrder.videoPublicId) {
                        await cloudinary.uploader.destroy(
                            shopOrder.videoPublicId,
                            { resource_type: "video" }
                        );
                    }

                    // DELETE FROM DB
                    shopOrder.videoUrl = "";
                    shopOrder.videoPublicId = "";
                    shopOrder.videoExpiresAt = null;

                    updated = true;
                }
            }

            if (updated) await order.save();
        }

        console.log(" Videos cleaned");

    } catch (error) {
        console.log("CRON ERROR:", error);
    }
});