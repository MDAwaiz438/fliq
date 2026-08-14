export interface WaitlistEntry {
  id: string;
  emailOrPhone: string;
  productSlug: string;
  productTitle: string;
  size?: string;
  type: "BACK_IN_STOCK" | "UPCOMING_DROP";
  createdAt: string;
}

let WAITLIST_STORE: WaitlistEntry[] = [];

class WaitlistService {
  /**
   * Registers a customer interest for out-of-stock items or upcoming drop launches
   */
  joinWaitlist(data: {
    emailOrPhone: string;
    productSlug: string;
    productTitle: string;
    size?: string;
    type?: "BACK_IN_STOCK" | "UPCOMING_DROP";
  }) {
    const { emailOrPhone, productSlug, productTitle, size, type = "BACK_IN_STOCK" } = data;

    if (!emailOrPhone || !productSlug) {
      throw new Error("emailOrPhone and productSlug are required");
    }

    const cleanContact = emailOrPhone.trim().toLowerCase();
    const entry: WaitlistEntry = {
      id: `wait_${Date.now()}`,
      emailOrPhone: cleanContact,
      productSlug,
      productTitle: productTitle || productSlug,
      size,
      type,
      createdAt: new Date().toISOString()
    };

    WAITLIST_STORE.push(entry);

    console.log(`[WAITLIST_SERVICE] Registered ${cleanContact} for ${productSlug} (${size || "All sizes"})`);

    return {
      success: true,
      message: `You're on the list! We'll alert ${cleanContact} instantly when this item is restocked.`,
      entry
    };
  }

  /**
   * Returns waitlist count aggregated by product
   */
  getWaitlistStats() {
    return {
      totalSubscribers: WAITLIST_STORE.length,
      entries: WAITLIST_STORE
    };
  }
}

export default new WaitlistService();
