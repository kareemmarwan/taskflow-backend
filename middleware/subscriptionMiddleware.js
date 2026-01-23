const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const requireSubscription = asyncHandler(async (req, res, next) => {
    const userId = req.user.id; // يأتي من auth middleware (JWT)

    const user = await User.findById(userId);

    if (!user) {
        res.status(401);
        throw new Error("User not found");
    }

    const subscription = user.subscription;

    // 1️⃣ هل الاشتراك فعال؟
    if (!subscription || !subscription.isActive) {
        res.status(403);
        throw new Error("Subscription required");
    }

    // 2️⃣ هل الاشتراك منتهي؟
    if (subscription.endDate && subscription.endDate < new Date()) {
        res.status(403);
        throw new Error("Subscription expired");
    }

    next(); // ✅ مسموح
});

module.exports = requireSubscription;
