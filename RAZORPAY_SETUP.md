# Razorpay Payment Setup & Testing Guide

## 📋 Step 1: Get Razorpay Test Keys

### Option A: Using Razorpay Dashboard (Recommended)

1. **Sign up / Login** to Razorpay Dashboard:
   - Go to: https://dashboard.razorpay.com/
   - Create an account if you don't have one (it's free)

2. **Switch to Test Mode**:
   - Toggle the "Test Mode" switch at the top right of the dashboard
   - You'll see "Test Mode" highlighted in orange

3. **Generate API Keys**:
   - Navigate to: **Settings** → **API Keys** (under "Website and app settings")
   - Click **"Generate Key"** button
   - A popup will show:
     - **Key ID**: `rzp_test_xxxxxxxxxxxxx` (starts with `rzp_test_`)
     - **Key Secret**: `xxxxxxxxxxxxxxxxxxxxx` (long string)
   - ⚠️ **IMPORTANT**: Copy the Key Secret immediately! It's only shown once.
   - Click "Download" to save both keys securely

4. **Add Keys to `.env`**:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_actual_key_secret_here
   ```

### Option B: Quick Test (If you just want to test the flow)

You can use Razorpay's public test keys for development (not recommended for production):
- These are available in Razorpay's documentation, but it's better to use your own keys.

---

## 🧪 Step 2: Test Payment Flow

### Prerequisites:
1. ✅ Backend running (`pnpm start:dev` in `backend/`)
2. ✅ Database migrations run (`pnpm migration:run`)
3. ✅ Razorpay keys added to `.env`
4. ✅ At least one course created with `price > 0`

### Test Flow:

#### 1. **Create a Course** (as Teacher):
```bash
POST http://localhost:8080/course
Authorization: Bearer <teacher_jwt_token>
Content-Type: application/json

{
  "title": "Test Course",
  "description": "A test course for payment",
  "teacherId": "<teacher_profile_id>",
  "price": "999.00",
  "emiAllowed": true,
  "emiCount": 3,
  "isPublished": true
}
```

#### 2. **Create Payment Order** (as Student):
```bash
POST http://localhost:8080/payment/create-order
Authorization: Bearer <student_jwt_token>
Content-Type: application/json

{
  "courseId": "<course_id_from_step_1>"
}
```

**Response:**
```json
{
  "orderId": "uuid-here",
  "razorpayOrderId": "order_xxxxx",
  "amount": 99900,
  "currency": "INR",
  "keyId": "rzp_test_xxxxx"
}
```

#### 3. **Test Payment Checkout** (Frontend):

Use Razorpay Checkout in your frontend:

```javascript
// Install: npm install razorpay
import Razorpay from 'razorpay';

const options = {
  key: response.keyId, // from create-order response
  amount: response.amount, // in paise (99900 = ₹999)
  currency: 'INR',
  name: 'Course Portal',
  description: 'Course Purchase',
  order_id: response.razorpayOrderId,
  handler: async function (response) {
    // Call verify endpoint
    await fetch('http://localhost:8080/payment/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${studentToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: orderId, // from create-order response
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature
      })
    });
  },
  prefill: {
    name: 'Student Name',
    email: 'student@example.com',
    contact: '9999999999'
  },
  theme: {
    color: '#3399cc'
  }
};

const razorpay = new Razorpay(options);
razorpay.open();
```

#### 4. **Use Test Cards** (Razorpay Sandbox):

When testing, use these test card numbers:

| Card Number | CVV | Expiry | Result |
|------------|-----|--------|--------|
| `4111 1111 1111 1111` | Any | Any future date | ✅ Success |
| `5555 5555 5555 4444` | Any | Any future date | ✅ Success (Mastercard) |
| `4000 0000 0000 0002` | Any | Any future date | ❌ Failure (Card declined) |

**Test OTP**: Use any 6-digit number (e.g., `123456`)

**Test UPI**: Use `success@razorpay` for success, `failure@razorpay` for failure

---

## 🔍 Step 3: Verify Everything Works

### Check Database:

1. **Order Created**:
   ```sql
   SELECT * FROM orders WHERE student_id = '<student_id>';
   ```

2. **EMI Records** (if EMI enabled):
   ```sql
   SELECT * FROM emis WHERE order_id = '<order_id>';
   ```

3. **Course Access Granted**:
   ```sql
   SELECT * FROM course_access WHERE student_id = '<student_id>' AND course_id = '<course_id>';
   ```
   Should show `status = 'active'`

### Test Course Access:

Try accessing the course:
```bash
GET http://localhost:8080/course/<course_id>
Authorization: Bearer <student_jwt_token>
```

Should return course details (not 403 Forbidden).

---

## 🐛 Troubleshooting

### Issue: "Razorpay is not configured"
- **Solution**: Check `.env` file has `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` set

### Issue: "Invalid payment signature"
- **Solution**: Make sure you're using the correct `razorpayOrderId` and `razorpayPaymentId` from the checkout response

### Issue: "Order already paid"
- **Solution**: Create a new order for testing

### Issue: Payment succeeds but CourseAccess not created
- **Solution**: Check backend logs for errors in `verifyPayment` method

---

## 📚 Additional Resources

- **Razorpay Docs**: https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/
- **Dashboard**: https://dashboard.razorpay.com/

---

## 🚀 Production Checklist

Before going live:

- [ ] Switch Razorpay Dashboard to **Live Mode**
- [ ] Generate **Live Mode** API keys (different from test keys)
- [ ] Update `.env` with Live keys
- [ ] Add your website domain in Razorpay Dashboard → Settings → API Keys
- [ ] Test with real small amount first
- [ ] Set up webhooks for payment status updates (optional)
- [ ] Enable email notifications in Razorpay Dashboard

---

**Note**: Test Mode keys start with `rzp_test_`, Live Mode keys start with `rzp_live_`.
