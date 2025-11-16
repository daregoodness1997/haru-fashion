# 🚀 Quick Start Guide - Prisma + PostgreSQL

Follow these steps to get your database up and running:

## Prerequisites

✅ PostgreSQL installed and running  
✅ Node.js and npm installed

## Step-by-Step Setup

### 1️⃣ Install PostgreSQL (if not installed)

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Check if running:**
```bash
brew services list | grep postgresql
# Should show "started"
```

### 2️⃣ Create Database

```bash
# Login to PostgreSQL
psql postgres

# Run these commands:
CREATE DATABASE Shunapee Fashion House_fashion;
\q
```

### 3️⃣ Configure Database URL

The `.env.local` file already has a DATABASE_URL. Update it if needed:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/Shunapee Fashion House_fashion?schema=public"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password (default is often empty or "postgres")

### 4️⃣ Generate Prisma Client

```bash
npm run prisma:generate
```

### 5️⃣ Run Database Migrations

```bash
npm run prisma:migrate
```

When prompted for a migration name, enter: `init`

### 6️⃣ Seed the Database

```bash
npm run prisma:seed
```

This creates:
- 25 products (men, women, accessories)
- 1 demo user (email: demo@example.com, password: password123)

### 7️⃣ Verify Setup

Open Prisma Studio to see your data:
```bash
npm run prisma:studio
```

Opens browser at `http://localhost:5555`

### 8️⃣ Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and test:
- Browse products by category
- View product details
- Login with demo@example.com / password123
- Add items to cart
- Checkout (creates order in database)

## ✅ Success Checklist

- [ ] PostgreSQL is running
- [ ] Database "Shunapee Fashion House_fashion" created
- [ ] DATABASE_URL configured in .env.local
- [ ] `npm run prisma:generate` completed
- [ ] `npm run prisma:migrate` completed
- [ ] `npm run prisma:seed` completed
- [ ] Prisma Studio shows 25 products and 1 user
- [ ] Next.js app running at localhost:3000

## 🐛 Common Issues

### "Can't reach database server"
```bash
# Check if PostgreSQL is running
brew services list

# Restart PostgreSQL
brew services restart postgresql@15
```

### "Database does not exist"
```bash
# Create the database
psql postgres -c "CREATE DATABASE Shunapee Fashion House_fashion;"
```

### "Password authentication failed"
Update DATABASE_URL in `.env.local` with correct password:
```env
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/Shunapee Fashion House_fashion?schema=public"
```

### "Prisma Client not found"
```bash
npm run prisma:generate
```

## 📚 Helpful Commands

```bash
# View database
npm run prisma:studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# View database schema
psql Shunapee Fashion House_fashion -c "\dt"
```

## 🎯 What's Next?

1. ✅ Database is set up
2. ✅ API endpoints connected to PostgreSQL
3. ✅ Authentication with bcrypt
4. ✅ Orders stored in database

Now you can:
- Create products via Prisma Studio
- Test checkout flow
- View orders in database
- Build new features!

## 📖 More Info

- **Detailed Setup:** [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- **Summary:** [PRISMA_SETUP_SUMMARY.md](./PRISMA_SETUP_SUMMARY.md)
- **Prisma Docs:** https://www.prisma.io/docs

---

**Need help?** Check the troubleshooting section in DATABASE_SETUP.md
