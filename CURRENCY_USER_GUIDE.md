# Currency System User Guide

## 🌍 Multi-Currency Support

Haru Fashion now supports dual currency display: **US Dollar (USD)** and **Nigerian Naira (NGN)**.

---

## 🔄 Switching Currency

### Desktop
1. Look for the currency dropdown in the **top navigation bar** (top-right corner)
2. Click on the current currency (e.g., "USD")
3. Select your preferred currency from the dropdown:
   - **USD** - United States Dollar
   - **NGN** - Nigerian Naira

### Mobile
1. Tap the **menu icon** (☰) in the top navigation
2. Scroll to find the **currency selector**
3. Tap to select your preferred currency

---

## 💰 How Prices Work

### Automatic Conversion
- All product prices are stored in **USD**
- When you select **NGN**, prices are automatically converted using the **live exchange rate**
- Exchange rates update every hour from a reliable API

### Example
```
Product Price: $100.00

When you select NGN:
$100.00 × 1,650 (current rate) = ₦165,000.00
```

### Price Display Format

**USD:**
```
$10.00
$1,234.56
```

**NGN:**
```
₦16,500.00
₦2,037,024.00
```
*(Note: Large numbers use comma separators for readability)*

---

## 🛒 Shopping with Your Currency

### Add to Cart
1. Select your preferred currency
2. Browse products - all prices will display in your chosen currency
3. Add items to cart
4. Cart totals automatically calculate in your selected currency

### Checkout
1. Your selected currency is maintained throughout checkout
2. Order summary shows all prices in your chosen currency
3. Final total is displayed in your selected currency

### Order Confirmation
- Order emails show prices in the currency you used at checkout
- Your order history displays orders in your current selected currency
- You can switch currencies to view orders in different denominations

---

## 📧 Email Notifications

### Customer Emails
When you place an order, you'll receive a confirmation email with:
- Order number
- Items ordered with prices in **your selected currency**
- Total amount in **your selected currency**

**Example (NGN):**
```
Order #12345
------------------------
Product A × 2    ₦33,000.00
Product B × 1    ₦82,500.00
------------------------
Total:          ₦115,500.00
```

**Example (USD):**
```
Order #12345
------------------------
Product A × 2    $20.00
Product B × 1    $50.00
------------------------
Total:           $70.00
```

---

## 💡 Currency Preference

### Saved Preference
- Your currency selection is **automatically saved**
- Next time you visit, your preferred currency will be **pre-selected**
- Works across all pages of the application

### Clearing Preference
To reset your currency preference:
1. Open browser developer tools (F12)
2. Go to **Application** tab
3. Find **Local Storage**
4. Delete the `currency` key
5. Refresh the page (defaults to USD)

---

## 🔍 Where Currency Applies

Currency conversion works on **all pages**:

✅ **Shopping Pages:**
- Home page
- Category pages (Men, Women, Bags, Material)
- Product detail pages
- Search results

✅ **User Pages:**
- Shopping cart
- Wishlist
- Checkout
- Order history
- Order details

✅ **Admin Pages:**
- Dashboard
- Orders list
- Order details
- Products list

---

## 📊 Exchange Rate Information

### Live Rates
- Exchange rates are fetched from a **reliable API**
- Rates update **every hour**
- Current rate displayed: **1 USD = ₦1,650** (approximate)

### Rate Caching
- Exchange rates are **cached for 1 hour**
- This improves performance and reduces API calls
- If the API is unavailable, a **fallback rate** is used

### Checking Current Rate
Developers can check the current exchange rate:
```bash
curl http://localhost:3000/api/exchange-rate
```

Response:
```json
{
  "success": true,
  "rate": 1650,
  "message": "Exchange rate retrieved"
}
```

---

## ❓ Frequently Asked Questions

### Q: Do prices change when I switch currency?
**A:** The **displayed price** changes based on the current exchange rate, but the **product's base price in USD** remains the same.

### Q: Which currency is used for payment?
**A:** Currently, the system displays prices in your selected currency. The actual payment processing depends on your payment gateway configuration.

### Q: Can I place an order in NGN?
**A:** Yes! Select NGN before checkout, and your order will be recorded with NGN as the currency. Your confirmation email will show NGN prices.

### Q: Will my old orders show in the new currency?
**A:** Yes, you can view any order in any currency. The system converts the stored USD price to your currently selected currency.

### Q: What if the exchange rate API is down?
**A:** The system uses a **fallback rate (₦1,650)** if the API is unavailable. Your shopping experience continues without interruption.

### Q: How often do exchange rates update?
**A:** Rates update **every hour** automatically. You can also force a refresh by visiting: `/api/exchange-rate?refresh=true`

---

## 🛠️ For Developers

### Using the Currency System

**Import the hook:**
```tsx
import { useCurrency } from '../context/CurrencyContext';

function MyComponent() {
  const { currency, setCurrency, formatPrice } = useCurrency();
  
  return (
    <div>
      <p>Current: {currency}</p>
      <p>Price: {formatPrice(100)}</p>
      <button onClick={() => setCurrency('NGN')}>
        Switch to NGN
      </button>
    </div>
  );
}
```

**Use the Price component:**
```tsx
import Price from '../components/Price/Price';

<Price amount={99.99} />
// Displays: "$99.99" or "₦164,983.50"

<Price amount={50} className="text-2xl font-bold" />
// With custom styling
```

### API Endpoints

**Get Exchange Rate:**
```
GET /api/exchange-rate
GET /api/exchange-rate?refresh=true
```

**Response:**
```json
{
  "success": true,
  "rate": 1650,
  "cacheInfo": {
    "hasCachedRate": true,
    "timestamp": 1234567890,
    "isExpired": false
  }
}
```

---

## 🎯 Tips for Best Experience

1. **Select your currency first** before adding items to cart
2. **Currency preference persists** - no need to select every visit
3. **All prices update instantly** when switching currencies
4. **Orders remember** which currency was used at checkout
5. **View order history** in any currency you prefer

---

## 📞 Need Help?

If you encounter any issues with currency conversion:

1. **Refresh the page** - Sometimes helps with display issues
2. **Clear browser cache** - Resolves localStorage conflicts
3. **Check console** - Look for any error messages
4. **Contact support** - Reach out to our team

---

## 🚀 Coming Soon

Future enhancements planned:
- Additional currencies (EUR, GBP, etc.)
- Historical exchange rate tracking
- Currency-specific pricing
- Auto-detect currency based on location

---

**Last Updated:** November 2, 2025  
**Version:** 1.0.0
