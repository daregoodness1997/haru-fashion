# Database Setup Guide

This project uses **Prisma** with **PostgreSQL** for data persistence.

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed

## Setup Steps

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Login to PostgreSQL
psql postgres

# Create database
CREATE DATABASE haru_fashion;

# Create user (optional)
CREATE USER haru_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE haru_fashion TO haru_user;

# Exit psql
\q
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` and update the `DATABASE_URL`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/haru_fashion?schema=public"
```

Replace:
- `username` with your PostgreSQL username (default: `postgres`)
- `password` with your PostgreSQL password
- `localhost:5432` with your PostgreSQL host and port
- `haru_fashion` with your database name

### 4. Run Prisma Migrations

Generate Prisma Client:
```bash
npm run prisma:generate
```

Create and apply migrations:
```bash
npm run prisma:migrate
```

When prompted, name your migration (e.g., "init")

### 5. Seed the Database

Populate the database with initial products and demo user:
```bash
npm run prisma:seed
```

This will create:
- 25 products across different categories
- 1 demo user (email: `demo@example.com`, password: `password123`)

### 6. Verify Setup

Open Prisma Studio to view your data:
```bash
npm run prisma:studio
```

This opens a browser-based database GUI at `http://localhost:5555`

## Available Scripts

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:seed` - Seed database with initial data
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Database Schema

### User
- id, email, fullname, password (hashed), phone, shippingAddress
- Related to: Orders

### Product
- id, name, price, category, image1, image2, description
- Related to: OrderItems

### Order
- id, orderNumber, customerId, shippingAddress, totalPrice, paymentType, deliveryType, orderDate, deliveryDate
- Related to: User, OrderItems

### OrderItem
- id, orderId, productId, quantity, price
- Related to: Order, Product

## Troubleshooting

### Connection Issues

If you get connection errors:
1. Verify PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
2. Check your DATABASE_URL in `.env.local`
3. Ensure the database exists: `psql -l`

### Migration Issues

Reset database and migrations:
```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Create a new database
3. Apply all migrations
4. Run seed script

### Permission Issues

If you get permission errors:
```bash
# Grant all privileges
psql postgres
GRANT ALL PRIVILEGES ON DATABASE haru_fashion TO your_username;
ALTER DATABASE haru_fashion OWNER TO your_username;
\q
```

## Production Deployment

For production (e.g., Vercel, Heroku):

1. Use a managed PostgreSQL service (e.g., Supabase, Railway, Neon)
2. Add DATABASE_URL as an environment variable
3. Run migrations in CI/CD:
   ```bash
   npx prisma migrate deploy
   ```

## Demo Credentials

After seeding, you can login with:
- **Email:** demo@example.com
- **Password:** password123

Note: The password will be properly hashed using bcrypt.
