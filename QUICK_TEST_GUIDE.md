# Quick Currency Testing Guide

## 🚀 Quick Start

### 1. Run Automated Tests
```bash
./test-currency.sh
```

### 2. Manual Testing (5 Minutes)

#### Test A: Currency Switching
1. Open http://localhost:3000
2. Click currency dropdown (top right)
3. Switch between USD and NGN
4. ✅ Verify: All prices update instantly

#### Test B: Price Conversion
1. Find a product with price $100.00
2. Switch to NGN
3. ✅ Verify: Price shows ₦165,000.00 (or current rate × 100)

#### Test C: Checkout with NGN
1. Add items to cart
2. Set currency to NGN
3. Proceed to checkout
4. Complete order
5. ✅ Verify: Order confirmation shows NGN prices

#### Test D: Exchange Rate API
```bash
# Get current rate
curl http://localhost:3000/api/exchange-rate

# Force refresh
curl http://localhost:3000/api/exchange-rate?refresh=true
```

#### Test E: Email Testing
1. Place order in NGN
2. Check email inbox
3. ✅ Verify: Email shows ₦ symbol and correct amounts

---

## 🐛 Common Issues

### Prices not converting?
- Check browser console for errors
- Verify CurrencyContext is loaded
- Refresh the page

### Exchange rate always 1650?
- API might be down (using fallback)
- Check console for error messages
- Try force refresh: `/api/exchange-rate?refresh=true`

### Orders not saving currency?
- Run: `npx prisma migrate status`
- Should show "add_currency_to_orders" applied
- If not, run: `npx prisma migrate dev`

---

## ✅ Success Indicators

When everything works, you should see:

1. **Browser Console:**
   ```
   🌐 Fetching live exchange rate from API...
   ✅ Fetched live exchange rate: 1650 NGN per USD
   ```

2. **API Response:**
   ```json
   {
     "success": true,
     "rate": 1650,
     "cacheInfo": { "hasCachedRate": true }
   }
   ```

3. **Price Display:**
   - USD: $100.00
   - NGN: ₦165,000.00

4. **Database:**
   - Order table has `currency` column
   - Orders store "USD" or "NGN"

---

## 📊 Full Test Checklist

See `CURRENCY_TESTING.md` for comprehensive test cases (50+ tests).

---

## 🔧 Troubleshooting Commands

```bash
# Check Prisma migration status
npx prisma migrate status

# Regenerate Prisma client
npx prisma generate

# View database
npx prisma studio

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

---

## 📞 Need Help?

Check these files:
- `context/CurrencyContext.tsx` - Currency state management
- `lib/exchangeRates.ts` - Exchange rate API logic
- `components/Price/Price.tsx` - Price display component
- `pages/api/exchange-rate.ts` - Exchange rate endpoint

---

**Last Updated:** November 2, 2025
