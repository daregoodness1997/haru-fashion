# Admin Panel Documentation

## Overview

The Haru Fashion admin panel provides super admin capabilities for managing products and orders. Admin users can:

- View dashboard with order and product statistics
- Manage orders (view, update status, add tracking numbers)
- Manage products (create, read, update, delete)

## Database Schema Updates

The following fields were added to the database:

### User Model
- `isAdmin` (Boolean, default: false) - Determines if a user has admin access

### Order Model
- `status` (String, default: "pending") - Order status: pending, processing, shipped, delivered, cancelled
- `trackingNumber` (String, optional) - Shipment tracking number

## Admin Features

### 1. Admin Dashboard (`/admin`)
- Total orders count
- Pending orders count
- Total products count
- Recent orders list
- Quick links to order and product management

### 2. Order Management (`/admin/orders`)
- View all orders with pagination
- Filter orders by status
- Update order status inline
- View customer details
- Access individual order details

### 3. Order Detail Page (`/admin/orders/[id]`)
- Full order information
- Customer details and shipping address
- Order items with images
- Update order status
- Add/update tracking number

### 4. Product Management (`/admin/products`)
- View all products in a grid
- Add new products with form
- Edit existing products
- Delete products with confirmation
- Product fields: name, price, category, images, description

## API Endpoints

### Admin Orders
- `GET /api/v1/admin/orders` - Get all orders (with filters and pagination)
- `PUT /api/v1/admin/orders` - Update order status and tracking

### Admin Products
- `POST /api/v1/admin/products` - Create new product
- `PUT /api/v1/admin/products` - Update existing product
- `DELETE /api/v1/admin/products?id={productId}` - Delete product

All admin endpoints require `userId` parameter to verify admin access.

## Making a User Admin

### Using the Script
```bash
# Make a user admin by email
npx tsx prisma/make-admin.ts user@example.com
```

### Manual Database Update
```sql
UPDATE users SET "isAdmin" = true WHERE email = 'user@example.com';
```

### For Development/Testing
Update the demo user in `prisma/seed.ts`:
```typescript
isAdmin: true,  // Add this field
```

Then reseed the database:
```bash
npx tsx prisma/seed.ts
```

## Access Control

### Middleware
Admin routes are protected by the `verifyAdmin` middleware in `lib/adminMiddleware.ts`:
- Checks if userId is provided in request
- Verifies user exists in database
- Confirms user has `isAdmin: true`
- Returns 403 error if not admin

### Frontend Protection
- Admin dashboard link only visible to admin users in mobile menu
- Pages check for `auth.user` before rendering
- API calls include userId for server-side verification

## Navigation

Admin users will see an additional menu item in the mobile navigation:
- 🛡️ Admin Dashboard (highlighted with yellow background)

Located between login/profile and other user links.

## Translations

Admin-related translations are available in English and Myanmar (Burmese):
- Admin dashboard labels
- Order status values
- Product management forms
- Success/error messages

Translation keys are in the `Admin` section of `messages/common/en.json` and `my.json`.

## Testing Admin Features

1. **Create an admin user:**
   ```bash
   npx tsx prisma/make-admin.ts user@example.com
   ```

2. **Login with admin account:**
   - Navigate to the site
   - Login with the admin user credentials

3. **Access admin panel:**
   - Open mobile menu
   - Click "🛡️ Admin Dashboard"
   - OR navigate directly to `/admin`

4. **Test order management:**
   - View all orders at `/admin/orders`
   - Click on an order to see details
   - Update order status and tracking number

5. **Test product management:**
   - View products at `/admin/products`
   - Add a new product
   - Edit an existing product
   - Delete a product

## Security Considerations

⚠️ **Important:** This implementation uses a simple admin flag and userId-based authentication. For production use, consider:

1. **Implement proper JWT or session-based authentication**
2. **Add HTTPS-only cookies for tokens**
3. **Implement rate limiting on admin endpoints**
4. **Add audit logging for admin actions**
5. **Use environment variables for admin emails**
6. **Implement two-factor authentication for admin accounts**
7. **Add IP whitelisting for admin routes**

## File Structure

```
pages/
  admin/
    index.tsx           # Admin dashboard
    orders/
      index.tsx         # Orders list
      [id].tsx          # Order detail page
    products/
      index.tsx         # Products management
      
pages/api/v1/admin/
  orders.ts             # Order management API
  products.ts           # Product management API

lib/
  adminMiddleware.ts    # Admin authentication middleware

prisma/
  make-admin.ts         # Script to grant admin access
  schema.prisma         # Updated with isAdmin and order status fields
```

## Common Issues

### Admin link not showing
- Ensure user has `isAdmin: true` in database
- Check that login API returns `isAdmin` field
- Verify `auth.user.isAdmin` is properly set in context

### API returns 403 Forbidden
- Verify userId is being passed in request
- Check user exists and has `isAdmin: true`
- Review middleware logs for errors

### Orders/Products not loading
- Verify Prisma client is properly initialized
- Check database connection
- Review API endpoint logs

## Future Enhancements

Potential improvements for the admin system:
- [ ] Product image upload functionality
- [ ] Bulk order operations
- [ ] Advanced reporting and analytics
- [ ] Export orders to CSV/Excel
- [ ] Email notifications for order status changes
- [ ] Product inventory management
- [ ] Customer management page
- [ ] Role-based permissions (manager, staff, etc.)
- [ ] Admin activity logs
