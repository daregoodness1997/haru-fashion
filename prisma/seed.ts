import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Seed products
  const products = [
    {
      name: "Classic White Shirt",
      price: 45.99,
      category: "men",
      image1:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
      image2:
        "https://images.unsplash.com/photo-1602810318084-4bee2d0c9e3f?w=500",
      description:
        "A timeless white shirt perfect for any occasion. Made from premium cotton.",
    },
    {
      name: "Elegant Black Dress",
      price: 89.99,
      category: "women",
      image1:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
      image2:
        "https://images.unsplash.com/photo-1595777457684-95e059d581b8?w=500",
      description:
        "Sophisticated black dress for evening events and special occasions.",
    },
    {
      name: "Denim Jacket",
      price: 79.99,
      category: "men",
      image1: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      image2: "https://images.unsplash.com/photo-1551028719-00167b16eac6?w=500",
      description:
        "Classic denim jacket with a modern fit. Perfect for casual outings.",
    },
    {
      name: "Summer Floral Dress",
      price: 65.99,
      category: "women",
      image1:
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
      image2:
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f2?w=500",
      description: "Light and breezy floral dress perfect for summer days.",
    },
    {
      name: "Leather Backpack",
      price: 120.0,
      category: "accessories",
      image1: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      image2: "https://images.unsplash.com/photo-1553062407-98eeb64c6a63?w=500",
      description:
        "Premium leather backpack with multiple compartments. Perfect for daily use.",
    },
    {
      name: "Casual Sneakers",
      price: 95.0,
      category: "men",
      image1: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      image2: "https://images.unsplash.com/photo-1549298916-b41d501d3773?w=500",
      description:
        "Comfortable sneakers for everyday wear. Available in multiple colors.",
    },
    {
      name: "Silk Scarf",
      price: 35.0,
      category: "accessories",
      image1:
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500",
      image2:
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc27?w=500",
      description: "Luxurious silk scarf with elegant patterns.",
    },
    {
      name: "Wool Coat",
      price: 199.99,
      category: "women",
      image1:
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
      image2:
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e4?w=500",
      description: "Warm and stylish wool coat for cold weather.",
    },
    {
      name: "Formal Suit",
      price: 299.99,
      category: "men",
      image1:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
      image2:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae36?w=500",
      description: "Professional suit for business meetings and formal events.",
    },
    {
      name: "Sunglasses",
      price: 85.0,
      category: "accessories",
      image1:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
      image2:
        "https://images.unsplash.com/photo-1572635196237-14b3f281504f?w=500",
      description: "UV protection sunglasses with modern design.",
    },
    {
      name: "Cotton T-Shirt",
      price: 25.0,
      category: "men",
      image1:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      image2:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ac?w=500",
      description: "Comfortable cotton t-shirt for casual wear.",
    },
    {
      name: "High Heels",
      price: 110.0,
      category: "women",
      image1: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500",
      image2: "https://images.unsplash.com/photo-1543163521-1bf539c55dd3?w=500",
      description: "Elegant high heels perfect for formal occasions.",
    },
    {
      name: "Striped Polo Shirt",
      price: 39.99,
      category: "men",
      image1:
        "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500",
      image2:
        "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d98?w=500",
      description: "Classic striped polo shirt for smart casual looks.",
    },
    {
      name: "Maxi Dress",
      price: 75.0,
      category: "women",
      image1:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
      image2:
        "https://images.unsplash.com/photo-1566174053879-31528523f8af?w=500",
      description: "Flowing maxi dress perfect for beach vacations.",
    },
    {
      name: "Chino Pants",
      price: 55.0,
      category: "men",
      image1:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
      image2:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae81?w=500",
      description: "Versatile chino pants suitable for work and casual wear.",
    },
    {
      name: "Knit Sweater",
      price: 68.0,
      category: "women",
      image1:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
      image2:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f28?w=500",
      description: "Cozy knit sweater for cooler days.",
    },
    {
      name: "Leather Belt",
      price: 42.0,
      category: "accessories",
      image1:
        "https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=500",
      image2:
        "https://images.unsplash.com/photo-1624222247344-550fb60583bc?w=500",
      description: "Premium leather belt with classic buckle.",
    },
    {
      name: "Sports Jacket",
      price: 125.0,
      category: "men",
      image1:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
      image2:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caeb?w=500",
      description: "Lightweight sports jacket for athletic activities.",
    },
    {
      name: "Cocktail Dress",
      price: 95.0,
      category: "women",
      image1:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
      image2:
        "https://images.unsplash.com/photo-1566174053879-31528523f8af?w=500",
      description: "Stylish cocktail dress for evening parties.",
    },
    {
      name: "Wrist Watch",
      price: 175.0,
      category: "accessories",
      image1:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",
      image2:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6e?w=500",
      description: "Elegant wrist watch with leather strap.",
    },
    {
      name: "Cargo Shorts",
      price: 48.0,
      category: "men",
      image1:
        "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500",
      image2:
        "https://images.unsplash.com/photo-1591195853828-11db59a44f6c?w=500",
      description: "Comfortable cargo shorts with multiple pockets.",
    },
    {
      name: "Cardigan",
      price: 58.0,
      category: "women",
      image1:
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500",
      image2:
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaab?w=500",
      description: "Soft cardigan perfect for layering.",
    },
    {
      name: "Canvas Bag",
      price: 32.0,
      category: "accessories",
      image1:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
      image2:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce8?w=500",
      description: "Eco-friendly canvas bag for everyday use.",
    },
    {
      name: "Running Shoes",
      price: 105.0,
      category: "men",
      image1: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      image2: "https://images.unsplash.com/photo-1542291026-7eec264c27fe?w=500",
      description: "High-performance running shoes for athletes.",
    },
    {
      name: "Blouse",
      price: 52.0,
      category: "women",
      image1:
        "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=500",
      image2:
        "https://images.unsplash.com/photo-1564859228273-274232fdb517?w=500",
      description: "Elegant blouse suitable for office wear.",
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`Seeded ${products.length} products`);

  // Create demo user with hashed password
  const hashedPassword = await bcrypt.hash("password123", 10);

  const demoUser = await prisma.user.create({
    data: {
      email: "demo@example.com",
      fullname: "Demo User",
      password: hashedPassword,
      phone: "+1234567890",
      shippingAddress: "123 Main St, City, State 12345",
      isAdmin: false,
    },
  });

  console.log(`Created demo user: ${demoUser.email}`);

  // Create super admin user
  const adminPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@shunapeefashion.com",
      fullname: "Super Admin",
      password: adminPassword,
      phone: "+1987654321",
      shippingAddress: "Shunapee Fashion HQ, Akwa Ibom State, Nigeria",
      isAdmin: true,
    },
  });

  console.log(`Created super admin user: ${adminUser.email}`);
  console.log(`Admin password: admin123`);

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
