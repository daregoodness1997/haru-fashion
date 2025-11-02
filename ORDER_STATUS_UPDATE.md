# Order Status Update - API Usage Guide

## Endpoint
`PATCH /api/v1/orders/{orderId}`

## Update Order Status with Email Notification

### Example: Update order status to "shipped"

```bash
curl -X PATCH http://localhost:3000/api/v1/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped",
    "trackingNumber": "TRACK123456789"
  }'
```

### Example: Update to "processing"

```bash
curl -X PATCH http://localhost:3000/api/v1/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "processing"
  }'
```

### Example: Mark as "delivered"

```bash
curl -X PATCH http://localhost:3000/api/v1/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "delivered"
  }'
```

## Available Status Values

- `pending` - Order received (default)
- `processing` - Being prepared
- `shipped` - On the way
- `delivered` - Successfully delivered
- `cancelled` - Order cancelled

## Response

Success response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": 1,
    "status": "shipped",
    "trackingNumber": "TRACK123456789",
    ...
  },
  "message": "Order updated successfully"
}
```

## Email Notifications

When order status changes, the customer will automatically receive:
- ✅ Professional email with status update
- 📦 Order number and new status
- 🔍 Tracking number (if provided)
- 🎨 Color-coded status banners:
  - 🟡 Pending - Orange
  - 🔵 Processing - Blue
  - 🟣 Shipped - Purple
  - 🟢 Delivered - Green
  - 🔴 Cancelled - Red

## Usage in JavaScript/TypeScript

```typescript
// Update order status
const updateOrderStatus = async (orderId: number, status: string, trackingNumber?: string) => {
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${orderId}`,
    { status, trackingNumber }
  );
  return response.data;
};

// Example usage
await updateOrderStatus(1, 'shipped', 'TRACK123456789');
await updateOrderStatus(2, 'delivered');
```

## Admin Panel Integration

You can integrate this into your admin panel to:
1. Display all orders with current status
2. Provide dropdown/buttons to change status
3. Optional field for tracking number
4. Automatically send email when status updates

Example admin UI code:
```typescript
const handleStatusChange = async (orderId: number, newStatus: string) => {
  try {
    const response = await axios.patch(`/api/v1/orders/${orderId}`, {
      status: newStatus
    });
    
    if (response.data.success) {
      alert('Order status updated! Email sent to customer.');
    }
  } catch (error) {
    console.error('Failed to update status:', error);
  }
};
```
