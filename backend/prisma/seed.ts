import { PrismaClient } from "@prisma/client";

declare const process: any;

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding FLIQ database with initial streetwear catalog...");

  // Seed Products
  const hoodie = await prisma.product.upsert({
    where: { slug: "distortion-hoodie" },
    update: {},
    create: {
      title: "Distortion Oversized Hoodie (Drop 03)",
      slug: "distortion-hoodie",
      description: "Heavyweight 450GSM custom loopback 100% cotton with raw-edge seams and distressed ribbing.",
      price: 3499,
      compareAtPrice: 4499,
      category: "HOODIES",
      images: ["/images/product_distortion.png"],
      variants: {
        create: [
          { sku: "FLIQ-AW26-HOOD-S", title: "Size S", color: "Washed Black", size: "S", price: 3499, inventoryQuantity: 25 },
          { sku: "FLIQ-AW26-HOOD-M", title: "Size M", color: "Washed Black", size: "M", price: 3499, inventoryQuantity: 50 },
          { sku: "FLIQ-AW26-HOOD-L", title: "Size L", color: "Washed Black", size: "L", price: 3499, inventoryQuantity: 40 },
          { sku: "FLIQ-AW26-HOOD-XL", title: "Size XL", color: "Washed Black", size: "XL", price: 3499, inventoryQuantity: 15 },
        ],
      },
    },
  });

  const shirt = await prisma.product.upsert({
    where: { slug: "viscose-embroidered-shirt" },
    update: {},
    create: {
      title: "100% Viscose Embroidered Box Fit Shirt",
      slug: "viscose-embroidered-shirt",
      description: "Lightweight silky viscose fabric with tonal high-density typography embroidery.",
      price: 1099,
      compareAtPrice: 1599,
      category: "SHIRTS",
      images: ["/images/shirt_viscose.png"],
      variants: {
        create: [
          { sku: "FLIQ-SHIRT-VISC-M", title: "Size M", color: "Off-White", size: "M", price: 1099, inventoryQuantity: 30 },
          { sku: "FLIQ-SHIRT-VISC-L", title: "Size L", color: "Off-White", size: "L", price: 1099, inventoryQuantity: 20 },
        ],
      },
    },
  });

  const polo = await prisma.product.upsert({
    where: { slug: "touch-grass-knit-polo" },
    update: {},
    create: {
      title: "Touch Grass Club Embroidered Polo T-Shirt",
      slug: "touch-grass-knit-polo",
      description: "280GSM heavy combed cotton knit with custom collar ribbing.",
      price: 1499,
      compareAtPrice: 1999,
      category: "T-SHIRTS",
      images: ["/images/polo_knit.png"],
      variants: {
        create: [
          { sku: "FLIQ-POLO-TG-M", title: "Size M", color: "Forest Green", size: "M", price: 1499, inventoryQuantity: 45 },
          { sku: "FLIQ-POLO-TG-L", title: "Size L", color: "Forest Green", size: "L", price: 1499, inventoryQuantity: 35 },
        ],
      },
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`- Created Products: ${hoodie.title}, ${shirt.title}, ${polo.title}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
