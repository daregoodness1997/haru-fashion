# Currency System Testing Checklist

This document outlines comprehensive tests for the USD ↔ NGN currency conversion system.

## Test Environment Setup

1. **Prerequisites**
   - Development server running: `npm run dev`
   - Database connected and migrated
   - Test user account created
   - Sample products in database

2. **Test Data**
   - Exchange Rate: 1 USD = ₦1,650 (or live rate from API)
   - Test Product Price: $100.00
   - Expected NGN Price: ₦165,000.00

---

## 1. Currency Context Tests

### ✅ Test 1.1: Initial Currency Load
**Steps:**
1. Open application in incognito/private window
2. Check default currency in header

**Expected:**
- Default currency should be USD
- Prices display with $ symbol

### ✅ Test 1.2: Currency Switching (Desktop)
**Steps:**
1. Navigate to any page with products
2. Click currency dropdown in top navigation
3. Select "NGN"
4. Observe price changes

**Expected:**
- All prices update immediately
- Prices show ₦ symbol
- Format: ₦165,000.00 (with commas)

### ✅ Test 1.3: Currency Switching (Mobile)
**Steps:**
1. Resize browser to mobile view (< 768px)
2. Open mobile menu (hamburger icon)
3. Click currency dropdown
4. Select "USD"

**Expected:**
- Currency changes to USD
- All prices update with $ symbol
- Format: $100.00

### ✅ Test 1.4: LocalStorage Persistence
**Steps:**
1. Switch currency to NGN
2. Refresh the page
3. Check currency selection

**Expected:**
- Currency remains NGN after refresh
- Preference saved in localStorage (key: "currency")

### ✅ Test 1.5: Cross-Tab Synchronization
**Steps:**
1. Open app in Tab 1, set currency to NGN
2. Open app in Tab 2 (new tab, same browser)

**Expected:**
- Tab 2 loads with NGN currency (from localStorage)

---

## 2. Price Component Tests

### ✅ Test 2.1: Product Cards
**Pages:** Home, Category Pages, Search Results

**Steps:**
1. Switch between USD and NGN
2. Verify all product card prices update

**Expected:**
- Prices format correctly in both currencies
- No "NaN" or undefined values
- Decimal places: USD (2), NGN (2)

### ✅ Test 2.2: Product Detail Page
**Page:** `/products/[id]`

**Steps:**
1. Navigate to product detail
2. Switch currency
3. Check main price display

**Expected:**
- Large price updates instantly
- Format matches selected currency

### ✅ Test 2.3: Shopping Cart
**Page:** `/shopping-cart`

**Steps:**
1. Add items to cart
2. Switch currency
3. Verify:
   - Unit prices
   - Subtotals (price × quantity)
   - Grand total

**Expected:**
- All calculations accurate
- NGN shows large numbers with commas
- USD shows standard decimal format

### ✅ Test 2.4: Wishlist
**Page:** `/wishlist`

**Steps:**
1. Add items to wishlist
2. Switch currency
3. Check all item prices

**Expected:**
- All wishlist item prices update correctly

---

## 3. Checkout & Orders Tests

### ✅ Test 3.1: Checkout Price Display
**Page:** `/checkout`

**Steps:**
1. Proceed to checkout with items
2. Switch currency
3. Verify order summary:
   - Item prices
   - Item totals
   - Grand total

**Expected:**
- All prices convert correctly
- Calculations remain accurate

### ✅ Test 3.2: Order Creation with Currency
**Steps:**
1. Set currency to NGN
2. Complete checkout
3. Check order confirmation

**Expected:**
- Order total shows in NGN
- Currency saved in database: "NGN"

### ✅ Test 3.3: Order History Display
**Page:** `/orders`

**Steps:**
1. Create orders in both USD and NGN
2. View order history
3. Switch currency while viewing

**Expected:**
- All order totals display in selected currency
- Item prices convert correctly

### ✅ Test 3.4: Order Detail Page
**Page:** `/orders/[id]`

**Steps:**
1. View order detail
2. Switch currency
3. Check:
   - Item prices
   - Quantities
   - Subtotal
   - Order total

**Expected:**
- All prices update with currency switch
- Calculations remain accurate

---

## 4. Admin Panel Tests

### ✅ Test 4.1: Admin Dashboard
**Page:** `/admin`

**Steps:**
1. Login as admin
2. View dashboard
3. Switch currency
4. Check recent orders table

**Expected:**
- Order totals display in selected currency

### ✅ Test 4.2: Admin Orders List
**Page:** `/admin/orders`

**Steps:**
1. View all orders
2. Switch currency
3. Verify order totals in table

**Expected:**
- All totals update correctly

### ✅ Test 4.3: Admin Order Detail
**Page:** `/admin/orders/[id]`

**Steps:**
1. View order detail
2. Switch currency
3. Check item prices and totals

**Expected:**
- All prices display in selected currency

### ✅ Test 4.4: Admin Products List
**Page:** `/admin/products`

**Steps:**
1. View products grid
2. Switch currency
3. Check product prices

**Expected:**
- All product prices update

---

## 5. Email Template Tests

### ✅ Test 5.1: Order Confirmation Email (USD)
**Steps:**
1. Set currency to USD
2. Place test order
3. Check email received

**Expected:**
- Subject: "Order Confirmation #XXX - Shunapee Fashion House Fashion"
- All prices show $ symbol
- Item prices: $X.XX
- Total: $X.XX

### ✅ Test 5.2: Order Confirmation Email (NGN)
**Steps:**
1. Set currency to NGN
2. Place test order
3. Check email received

**Expected:**
- All prices show ₦ symbol
- Format: ₦X,XXX.XX
- Calculations accurate

### ✅ Test 5.3: Admin Order Notification (USD)
**Steps:**
1. Set currency to USD
2. Place order
3. Check admin email

**Expected:**
- Subject: "🛍️ New Order #XXX - Shunapee Fashion House Fashion"
- All prices in USD format
- Item details correct

### ✅ Test 5.4: Admin Order Notification (NGN)
**Steps:**
1. Set currency to NGN
2. Place order
3. Check admin email

**Expected:**
- All prices in NGN format
- Customer info displays correctly

---

## 6. Exchange Rate API Tests

### ✅ Test 6.1: Live Rate Fetching
**Steps:**
1. Open browser console
2. Navigate to any page
3. Check console for exchange rate log

**Expected:**
- Console log: "🌐 Fetching live exchange rate from API..."
- Console log: "✅ Fetched live exchange rate: XXXX NGN per USD"
- No errors

### ✅ Test 6.2: Cache Functionality
**Steps:**
1. Refresh page multiple times within 1 hour
2. Check console logs

**Expected:**
- First load: Fetches from API
- Subsequent loads: "🔄 Using cached exchange rate: XXXX"

### ✅ Test 6.3: API Endpoint Test
**Steps:**
1. Open: `http://localhost:3000/api/exchange-rate`
2. Check JSON response

**Expected:**
```json
{
  "success": true,
  "rate": 1650,
  "cacheInfo": {
    "hasCachedRate": true,
    "rate": 1650,
    "timestamp": 1234567890,
    "age": 12345,
    "isExpired": false
  },
  "message": "Exchange rate retrieved"
}
```

### ✅ Test 6.4: Force Refresh
**Steps:**
1. Open: `http://localhost:3000/api/exchange-rate?refresh=true`
2. Check response

**Expected:**
- New rate fetched
- Cache cleared
- Message: "Fresh exchange rate fetched"

### ✅ Test 6.5: Fallback on API Failure
**Steps:**
1. Disconnect internet or block API
2. Reload application
3. Check console

**Expected:**
- Console log: "❌ Error fetching exchange rate"
- Console log: "⚠️ Using fallback rate: 1650"
- Application still works with fallback rate

---

## 7. Edge Cases & Error Handling

### ✅ Test 7.1: Zero Price Handling
**Steps:**
1. Create product with price 0
2. Switch currency

**Expected:**
- $0.00 or ₦0.00
- No errors

### ✅ Test 7.2: Very Large Prices
**Steps:**
1. Create product with price $10,000
2. Switch to NGN

**Expected:**
- NGN: ₦16,500,000.00
- Proper comma formatting
- No overflow issues

### ✅ Test 7.3: Decimal Precision
**Steps:**
1. Create product with price $99.99
2. Switch to NGN
3. Calculate: 99.99 × 1650

**Expected:**
- NGN: ₦164,983.50
- Correct decimal places maintained

### ✅ Test 7.4: Rapid Currency Switching
**Steps:**
1. Switch currency rapidly (10+ times)
2. Check for:
   - Memory leaks
   - UI flickering
   - Incorrect calculations

**Expected:**
- No performance issues
- Smooth transitions
- Accurate prices

---

## 8. Performance Tests

### ✅ Test 8.1: Page Load Time
**Steps:**
1. Clear cache
2. Load product listing page
3. Measure time to interactive

**Expected:**
- Page loads < 3 seconds
- Exchange rate fetching doesn't block render

### ✅ Test 8.2: Currency Switch Performance
**Steps:**
1. Load page with 50+ products
2. Switch currency
3. Measure update time

**Expected:**
- All prices update < 200ms
- No UI freezing

---

## 9. Database Verification

### ✅ Test 9.1: Order Currency Storage
**Steps:**
1. Create order in NGN
2. Check database:
```sql
SELECT id, orderNumber, totalPrice, currency FROM "Order" WHERE id = [order_id];
```

**Expected:**
- currency column: "NGN"
- totalPrice: original USD value (100.00)

### ✅ Test 9.2: Migration Verification
**Steps:**
1. Check Prisma migration files
2. Run: `npx prisma migrate status`

**Expected:**
- Migration "add_currency_to_orders" applied
- No pending migrations

---

## 10. Cross-Browser Tests

### ✅ Test 10.1: Chrome
- [ ] Currency switching works
- [ ] Prices format correctly
- [ ] localStorage persists

### ✅ Test 10.2: Firefox
- [ ] All functionality works
- [ ] No console errors

### ✅ Test 10.3: Safari
- [ ] Currency selection persists
- [ ] Prices display correctly

### ✅ Test 10.4: Mobile Browsers
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Mobile menu currency selector works

---

## Quick Test Commands

```bash
# Start development server
npm run dev

# Test exchange rate API
curl http://localhost:3000/api/exchange-rate

# Force refresh exchange rate
curl http://localhost:3000/api/exchange-rate?refresh=true

# Check database
npx prisma studio

# View logs
# Check browser console for currency-related logs
```

---

## Expected Console Logs

When everything is working correctly, you should see:

```
🌐 Fetching live exchange rate from API...
✅ Fetched live exchange rate: 1650 NGN per USD
📅 Last updated: Sat, 02 Nov 2025 12:00:00 GMT

// On subsequent loads (within 1 hour):
🔄 Using cached exchange rate: 1650
```

---

## Common Issues & Solutions

### Issue 1: Prices not updating
**Solution:** Check CurrencyContext is wrapping the app in `_app.tsx`

### Issue 2: Exchange rate always uses fallback
**Solution:** 
- Check internet connection
- Verify API URL in `.env`
- Check API rate limits

### Issue 3: localStorage not persisting
**Solution:**
- Check browser privacy settings
- Verify localStorage is enabled
- Clear browser cache and retry

### Issue 4: TypeScript errors
**Solution:**
- Run `npx prisma generate`
- Restart TypeScript server in VS Code

---

## Test Report Template

```markdown
## Test Execution Report
**Date:** [Date]
**Tester:** [Name]
**Environment:** Development

### Summary
- Total Tests: 50
- Passed: XX
- Failed: XX
- Skipped: XX

### Failed Tests
1. [Test ID]: [Description]
   - Issue: [What went wrong]
   - Steps to reproduce: [...]
   - Expected: [...]
   - Actual: [...]

### Notes
[Any additional observations]
```

---

## Automated Testing (Future Enhancement)

Consider adding:
- Jest unit tests for currency conversion functions
- Cypress E2E tests for currency switching
- API tests for exchange rate endpoint
- Performance tests with Lighthouse
