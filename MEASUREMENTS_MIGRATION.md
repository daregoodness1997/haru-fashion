# Database Migration Instructions

## Added Features:
1. **Size variant** to cart and orders
2. **Body measurements** to user profile
3. **Social media links** updated (WhatsApp, Facebook, Instagram)

## Run these commands to apply database changes:

```bash
# Generate Prisma client with new schema
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_measurements_and_size

# Or if in production
npx prisma migrate deploy
```

## Schema Changes:

### User Model
Added measurement fields:
- chest, waist, hips
- shoulderWidth, sleeveLength
- inseam, outseam
- neckSize, height, weight
- additionalNotes

### OrderItem Model
Added fields:
- size (string, optional) - stores S/M/L size selection
- useMeasurements (boolean, default false) - for future use

## Testing:
1. Update your profile with measurements at `/profile/edit`
2. Add product to cart (size will be saved)
3. Complete checkout - size will be included in order
4. Check admin orders - size should display in order items
