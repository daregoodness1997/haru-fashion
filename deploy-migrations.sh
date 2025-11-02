#!/bin/bash
# Deploy Prisma migrations to production database
# Usage: ./deploy-migrations.sh

echo "🚀 Deploying Prisma migrations to production..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  echo "Please set it first:"
  echo "  export DATABASE_URL='your-production-database-url'"
  exit 1
fi

echo "📊 Database URL: ${DATABASE_URL:0:30}..."

# Apply migrations
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "✅ Migrations deployed successfully!"
else
  echo "❌ Migration deployment failed"
  exit 1
fi

# Optional: Seed the database
read -p "Do you want to seed the database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  npm run prisma:seed
  echo "✅ Database seeded successfully!"
fi

echo "🎉 Done!"
