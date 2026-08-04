import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Delete existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  // 2. Define products based on the original data.ts
  const products = [
    {
      name: "Oversized Hoodie",
      price: 120,
      category: "Apparel",
      color: "Black",
      images: JSON.stringify(["/prod-1.jpg", "/prod-2.jpg"]),
      description: "Heavyweight 500gsm cotton fleece. Drop shoulder fit. Designed for the concrete jungle. Raw form, maximum utility.",
      isNew: true,
      variants: [
        { size: "S", sku: "HD-BLK-S", stock: 15, lowStock: 5 },
        { size: "M", sku: "HD-BLK-M", stock: 25, lowStock: 5 },
        { size: "L", sku: "HD-BLK-L", stock: 10, lowStock: 5 },
        { size: "XL", sku: "HD-BLK-XL", stock: 3, lowStock: 5 }, // Low stock!
      ]
    },
    {
      name: "Modular Sneaker",
      price: 180,
      category: "Footwear",
      color: "White",
      images: JSON.stringify(["/prod-3.jpg", "/prod-4.jpg"]),
      description: "Utilitarian footwear featuring a chunky Vibram sole, layered technical mesh, and speed lacing system.",
      isNew: true,
      variants: [
        { size: "8", sku: "SNK-WHT-8", stock: 8, lowStock: 3 },
        { size: "9", sku: "SNK-WHT-9", stock: 12, lowStock: 3 },
        { size: "10", sku: "SNK-WHT-10", stock: 15, lowStock: 3 },
        { size: "11", sku: "SNK-WHT-11", stock: 5, lowStock: 3 },
      ]
    },
    {
      name: "Tech Cargo Pants",
      price: 140,
      category: "Apparel",
      color: "Black",
      images: JSON.stringify(["/prod-2.jpg", "/prod-1.jpg"]),
      description: "Water-repellent ripstop nylon. Eight articulated pockets. Articulated knees for full range of motion.",
      isNew: false,
      variants: [
        { size: "28", sku: "CRG-BLK-28", stock: 10, lowStock: 4 },
        { size: "30", sku: "CRG-BLK-30", stock: 18, lowStock: 4 },
        { size: "32", sku: "CRG-BLK-32", stock: 22, lowStock: 4 },
        { size: "34", sku: "CRG-BLK-34", stock: 12, lowStock: 4 },
      ]
    },
    {
      name: "Utility Vest",
      price: 110,
      category: "Apparel",
      color: "Black",
      images: JSON.stringify(["/prod-4.jpg"]),
      description: "Tactical layering piece. Multiple concealed zip pockets. Heavy-duty hardware and adjustable webbing straps.",
      isNew: true,
      variants: [
        { size: "M", sku: "VST-BLK-M", stock: 0, lowStock: 5 }, // Out of stock!
        { size: "L", sku: "VST-BLK-L", stock: 5, lowStock: 5 },
      ]
    },
    {
      name: "Brutalist Tee",
      price: 65,
      category: "Apparel",
      color: "White",
      images: JSON.stringify(["/prod-1.jpg"]),
      description: "Boxy fit heavyweight t-shirt. Clean lines, dropped shoulders, raw hems.",
      isNew: false,
      variants: [
        { size: "M", sku: "TEE-WHT-M", stock: 50, lowStock: 10 },
        { size: "L", sku: "TEE-WHT-L", stock: 45, lowStock: 10 },
        { size: "XL", sku: "TEE-WHT-XL", stock: 30, lowStock: 10 },
      ]
    },
    {
      name: "Combat Boots",
      price: 220,
      category: "Footwear",
      color: "Black",
      images: JSON.stringify(["/prod-3.jpg"]),
      description: "Full-grain leather combat boot with lugged rubber outsole and medial zip closure.",
      isNew: false,
      variants: [
        { size: "9", sku: "BT-BLK-9", stock: 10, lowStock: 2 },
        { size: "10", sku: "BT-BLK-10", stock: 15, lowStock: 2 },
      ]
    }
  ];

  // 3. Create products and variants
  for (const p of products) {
    const { variants, ...productData } = p;
    
    await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants
        }
      }
    });
  }

  // 4. Create some mock orders
  const allVariants = await prisma.productVariant.findMany();
  
  if (allVariants.length > 0) {
    await prisma.order.create({
      data: {
        customer: "johndoe@email.com",
        status: "Processing",
        total: 120,
        items: {
          create: [
            {
              variantId: allVariants[0].id,
              quantity: 1,
              price: 120
            }
          ]
        }
      }
    });

    await prisma.order.create({
      data: {
        customer: "alexsmith@email.com",
        status: "Shipped",
        total: 180,
        items: {
          create: [
            {
              variantId: allVariants[4].id, // A sneaker variant
              quantity: 1,
              price: 180
            }
          ]
        }
      }
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
