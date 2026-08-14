# FLIQ — Full Site Architecture & Page Inventory

This is the master route table. Every page listed here has a corresponding spec in
`DESIGN.md` (visual/UX) and `SKILL.md` (build/data requirements). Nothing gets built
that isn't in this table, and nothing in this table gets skipped.

## A. Storefront — Public Routes

| # | Route | Page | Auth |
|---|-------|------|------|
| 1 | `/` | Home | Public |
| 2 | `/shop` | Shop All (PLP) | Public |
| 3 | `/shop/[category]` | Category PLP | Public |
| 4 | `/shop/[category]/[subcategory]` | Subcategory PLP | Public |
| 5 | `/product/[slug]` | Product Detail Page | Public |
| 6 | `/search` | Search Results | Public |
| 7 | `/drops` | Drop Calendar / Archive | Public |
| 8 | `/drops/[slug]` | Drop Detail | Public |
| 9 | `/collab` | Collab Index | Public |
| 10 | `/collab/[slug]` | Collab Detail | Public |
| 11 | `/lookbook` | Lookbook / Editorial Index | Public |
| 12 | `/lookbook/[slug]` | Lookbook Story | Public |
| 13 | `/about` | About / Brand Story | Public |
| 14 | `/size-guide` | Size Guide | Public |
| 15 | `/shipping-returns` | Shipping & Returns Policy | Public |
| 16 | `/faq` | FAQ | Public |
| 17 | `/contact` | Contact Us | Public |
| 18 | `/track-order` | Order Tracking (guest lookup) | Public |
| 19 | `/gift-cards` | Gift Card Purchase | Public |
| 20 | `/gift-cards/balance` | Gift Card Balance Check | Public |
| 21 | `/terms` | Terms of Service | Public |
| 22 | `/privacy` | Privacy Policy | Public |
| 23 | `/cookies` | Cookie Policy | Public |
| 24 | `/careers` | Careers | Public |
| 25 | `/press` | Press / Media Kit | Public |
| 26 | `/stockists` | Store Locator / Stockists | Public |
| 27 | `/referral` | Referral Program | Public |

## B. Storefront — Transactional Routes

| # | Route | Page | Auth |
|---|-------|------|------|
| 28 | `/cart` | Cart | Public (guest cart via session) |
| 29 | `/checkout` | Checkout — Contact | Public |
| 30 | `/checkout/shipping` | Checkout — Shipping | Public |
| 31 | `/checkout/payment` | Checkout — Payment | Public |
| 32 | `/checkout/review` | Checkout — Review | Public |
| 33 | `/order/[id]/confirmation` | Order Confirmation | Public (token-gated) |
| 34 | `/order/[id]/failed` | Payment Failed | Public (token-gated) |

## C. Storefront — Account Routes (Authenticated)

| # | Route | Page | Auth |
|---|-------|------|------|
| 35 | `/login` | Login | Guest only |
| 36 | `/register` | Register | Guest only |
| 37 | `/forgot-password` | Forgot Password | Guest only |
| 38 | `/reset-password` | Reset Password | Token |
| 39 | `/verify-otp` | OTP Verification | Session |
| 40 | `/account` | Account Dashboard | User |
| 41 | `/account/orders` | Order History | User |
| 42 | `/account/orders/[id]` | Order Detail | User |
| 43 | `/account/addresses` | Saved Addresses | User |
| 44 | `/account/profile` | Profile & Security | User |
| 45 | `/account/wishlist` | Wishlist | User |
| 46 | `/account/loyalty` | Loyalty / FLIQ Points | User |
| 47 | `/account/returns` | Returns List | User |
| 48 | `/account/returns/[id]` | Return Detail | User |
| 49 | `/account/returns/new` | New Return Request | User |
| 50 | `/account/notifications` | Notification Preferences | User |

## D. System / Error Routes

| # | Route | Page |
|---|-------|------|
| 51 | `/404` | Not Found |
| 52 | `/500` | Server Error |
| 53 | `/maintenance` | Maintenance Mode |
| 54 | `/offline` | PWA Offline Fallback |

## E. Admin Dashboard — `/admin/*` (Staff-only, separate app)

| # | Route | Page | Min. Role |
|---|-------|------|-----------|
| 55 | `/admin/login` | Admin Login (2FA) | Staff |
| 56 | `/admin` | Overview Dashboard | Staff |
| 57 | `/admin/products` | Product List | Staff |
| 58 | `/admin/products/new` | Create Product | Admin |
| 59 | `/admin/products/[id]` | Edit Product | Admin |
| 60 | `/admin/categories` | Category Management | Admin |
| 61 | `/admin/drops` | Drop List | Admin |
| 62 | `/admin/drops/new` | Create Drop | Admin |
| 63 | `/admin/drops/[id]` | Edit Drop / Launch Control | Admin |
| 64 | `/admin/collabs` | Collab Management | Admin |
| 65 | `/admin/orders` | Order List | Staff |
| 66 | `/admin/orders/[id]` | Order Detail / Actions | Staff |
| 67 | `/admin/customers` | Customer List | Staff |
| 68 | `/admin/customers/[id]` | Customer Detail | Staff |
| 69 | `/admin/inventory` | Inventory Overview (stock matrix) | Warehouse+ |
| 70 | `/admin/inventory/warehouses` | Warehouse Management | Admin |
| 71 | `/admin/inventory/transfers` | Stock Transfers | Warehouse+ |
| 72 | `/admin/inventory/purchase-orders` | Purchase Orders | Warehouse+ |
| 73 | `/admin/inventory/movements` | Movement Audit Log | Warehouse+ |
| 74 | `/admin/inventory/alerts` | Low-Stock Alert Config | Admin |
| 75 | `/admin/discounts` | Discount Codes | Admin |
| 76 | `/admin/discounts/new` | Create Discount | Admin |
| 77 | `/admin/reviews` | Review Moderation Queue | Staff |
| 78 | `/admin/returns` | Returns Management | Staff |
| 79 | `/admin/returns/[id]` | Return Detail / Refund Action | Staff |
| 80 | `/admin/shipping` | Shipping Zones & Rates | Admin |
| 81 | `/admin/payments` | Payment Gateway Settings | Super Admin |
| 82 | `/admin/analytics` | Analytics & Reports | Staff |
| 83 | `/admin/analytics/inventory-valuation` | Inventory Valuation Report | Admin |
| 84 | `/admin/content` | Homepage / Banner CMS | Admin |
| 85 | `/admin/email-templates` | Email Template Editor | Admin |
| 86 | `/admin/staff` | Staff & Roles | Super Admin |
| 87 | `/admin/audit-log` | System Audit Log | Super Admin |
| 88 | `/admin/settings` | General Store Settings | Super Admin |

**Total: 88 routes.** Every route above is specced in DESIGN.md (Section 6) and has
data/API requirements defined in SKILL.md (Section 4).
