import Coupon from "../models/Coupon.js";

// Create a coupon (Admin only)
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discount,
      discountType,
      minOrderValue,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
    } = req.body;

    const coupon = new Coupon({
      code,
      discount,
      discountType,
      minOrderValue,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
    });

    await coupon.save();
    res
      .status(201)
      .json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validate and apply coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderValue } = req.body;

    if (!code || !orderValue) {
      return res
        .status(400)
        .json({ message: "Code and order value are required" });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or inactive" });
    }

    // Check validity period
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({ message: "Coupon is not valid" });
    }

    // Check minimum order value
    if (orderValue < coupon.minOrderValue) {
      return res
        .status(400)
        .json({
          message: `Minimum order value of ₹${coupon.minOrderValue} required`,
        });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit exceeded" });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (orderValue * coupon.discount) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discount;
    }

    res.status(200).json({
      message: "Coupon is valid",
      discount: discountAmount,
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all coupons (Admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a coupon (Admin)
export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findByIdAndDelete(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
