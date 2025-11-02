# 🔐 Admin & Cloudinary Quick Reference

## Super Admin Access

### Login Credentials
```
📧 Email: admin@harufashion.com
🔑 Password: admin123
```

### How to Access
1. Navigate to http://localhost:3000
2. Login with admin credentials
3. Open mobile menu (hamburger icon)
4. Click "🛡️ Admin Dashboard"

---

## Cloudinary Setup (Required for Image Uploads)

### 1. Get Credentials
Visit: **https://cloudinary.com/console**
- Create free account or sign in
- From dashboard, copy:
  - ☁️ Cloud Name
  - 🔑 API Key
  - 🔐 API Secret

### 2. Update Environment Files

**`.env` file:**
```bash
CLOUDINARY_CLOUD_NAME="your_actual_cloud_name"
CLOUDINARY_API_KEY="your_actual_api_key"
CLOUDINARY_API_SECRET="your_actual_api_secret"
```

**`.env.local` file:**
```bash
CLOUDINARY_CLOUD_NAME="your_actual_cloud_name"
CLOUDINARY_API_KEY="your_actual_api_key"
CLOUDINARY_API_SECRET="your_actual_api_secret"
```

### 3. Restart Server
```bash
npm run dev
```

---

## Test Image Upload

1. Login as admin
2. Go to: Admin Dashboard → Manage Products
3. Click "Add New Product"
4. Fill in product details
5. Select image files (max 5MB each)
6. Submit form
7. ✅ Images automatically upload to Cloudinary!

---

## Quick Commands

```bash
# Reseed database (includes super admin)
npx tsx prisma/seed.ts

# Make existing user admin
npx tsx prisma/make-admin.ts user@example.com

# Check Prisma schema
npx prisma studio
```

---

## Installed Packages
```bash
npm install cloudinary multer
npm install --save-dev @types/multer
```

---

## 📚 Full Documentation
- [Cloudinary Setup](./CLOUDINARY_SETUP.md) - Complete image upload guide
- [Admin Features](./ADMIN_DOCUMENTATION.md) - All admin capabilities
- [Database Setup](./QUICK_START.md) - PostgreSQL & Prisma setup

---

## ⚠️ Troubleshooting

**Upload fails (401):**
→ Check Cloudinary credentials in both .env files

**Can't access admin panel:**
→ Verify user has isAdmin: true in database

**Images not showing:**
→ Restart server after adding Cloudinary credentials

---

**🎯 Next Steps:** Add your Cloudinary credentials and test image upload!
