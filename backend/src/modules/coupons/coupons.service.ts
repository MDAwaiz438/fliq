export interface CouponRule {
  code: string;
  type: "PERCENTAGE" | "FLAT";
  value: number; // e.g. 10 for 10% or 300 for ₹300
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  isActive: boolean;
  expiresAt?: string;
}

const AVAILABLE_COUPONS: Record<string, CouponRule> = {
  FLIQ10: {
    code: "FLIQ10",
    type: "PERCENTAGE",
    value: 10,
    minOrderValue: 999,
    maxDiscount: 500,
    description: "10% Instant Discount on First Drop Order",
    isActive: true
  },
  STREET20: {
    code: "STREET20",
    type: "PERCENTAGE",
    value: 20,
    minOrderValue: 2499,
    maxDiscount: 1000,
    description: "20% Off on orders above ₹2,499",
    isActive: true
  },
  FLIQVIP: {
    code: "FLIQVIP",
    type: "FLAT",
    value: 500,
    minOrderValue: 2999,
    description: "Flat ₹500 Off VIP Atelier Pass",
    isActive: true
  },
  FREESHIP: {
    code: "FREESHIP",
    type: "FLAT",
    value: 150,
    minOrderValue: 499,
    description: "Free Express Shipping Discount",
    isActive: true
  }
};

class CouponsService {
  /**
   * Validates a coupon code against the cart subtotal and calculates discount
   */
  validateCoupon(code: string, subtotal: number) {
    if (!code) {
      throw new Error("Coupon code is required");
    }

    const upperCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[upperCode];

    if (!coupon || !coupon.isActive) {
      throw new Error(`Coupon code '${upperCode}' is invalid or expired`);
    }

    if (subtotal < coupon.minOrderValue) {
      throw new Error(
        `Coupon '${upperCode}' requires a minimum order value of ₹${coupon.minOrderValue.toLocaleString()}`
      );
    }

    let discountAmount = 0;
    if (coupon.type === "PERCENTAGE") {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === "FLAT") {
      discountAmount = coupon.value;
    }

    // Ensure discount does not exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    return {
      valid: true,
      code: coupon.code,
      type: coupon.type,
      discountAmount,
      finalTotal,
      description: coupon.description,
      savingsMessage: `You save ₹${discountAmount.toLocaleString()} with ${coupon.code}!`
    };
  }

  /**
   * Returns list of currently active public coupons for promotion
   */
  getActiveCoupons() {
    return Object.values(AVAILABLE_COUPONS)
      .filter((c) => c.isActive)
      .map((c) => ({
        code: c.code,
        type: c.type,
        value: c.value,
        minOrderValue: c.minOrderValue,
        description: c.description
      }));
  }
}

export default new CouponsService();
