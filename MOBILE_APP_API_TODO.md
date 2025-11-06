# Mobile App API Implementation TODO

## 🎯 **Objective**
Create API endpoints that mobile apps can use to interact with screen data and user information. Each template screen needs corresponding API endpoints to fetch, create, update, and delete data.

---

## 📋 **Current Status** (Updated: Nov 3, 2025)

**Templates Created:** 26/250
**API Endpoints Implemented:** 4/26 (Authentication complete)

### ✅ **COMPLETED - Phase 1 & 2: Authentication & User Management**
- Database tables: app_users, user_sessions, user_settings, user_activity_log
- Mobile Auth API: register, login, logout, verify-email
- Admin User Management: Full CRUD + stats dashboard
- JWT authentication middleware working
- Admin portal page: /app/[id]/app-users

### 🚧 **IN PROGRESS - Phase 3: User Profile Management**
- Next: GET/PUT /api/v1/mobile/profile
- Next: Avatar upload functionality
- Next: Password reset flow

---

## 🔧 **API Architecture Overview**

### **Base URL Structure**
```
/api/mobile/apps/:appId/...
```

### **Authentication**
- All endpoints require JWT token authentication
- Token includes: user_id, app_id, permissions
- Middleware: `authenticateMobileUser`

### **Response Format**
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

---

## 📱 **API Endpoints by Template Category**

### **1. Authentication & Onboarding (9 templates)**

#### ✅ **Splash Screen**
- No API needed (static display)

#### ✅ **Onboarding**
- No API needed (static slides)

#### ✅ **Login**
- [ ] `POST /api/mobile/auth/login`
  - Body: `{ email, password }`
  - Returns: `{ token, user }`
  - Creates session

#### ✅ **Sign Up**
- [ ] `POST /api/mobile/auth/register`
  - Body: `{ email, password, first_name, last_name, phone }`
  - Returns: `{ token, user }`
  - Creates new user account

#### ✅ **Forgot Password**
- [ ] `POST /api/mobile/auth/forgot-password`
  - Body: `{ email }`
  - Returns: `{ message, reset_token_sent }`
  - Sends password reset email

#### ✅ **Reset Password**
- [ ] `POST /api/mobile/auth/reset-password`
  - Body: `{ token, new_password }`
  - Returns: `{ message }`
  - Updates password with reset token

#### ✅ **Email Verification**
- [ ] `POST /api/mobile/auth/verify-email`
  - Body: `{ verification_code }`
  - Returns: `{ message, verified }`
  - Marks email as verified

- [ ] `POST /api/mobile/auth/resend-verification`
  - Body: `{ email }`
  - Returns: `{ message }`
  - Resends verification email

#### ✅ **Terms & Conditions**
- [ ] `GET /api/mobile/apps/:appId/legal/terms`
  - Returns: `{ content, version, last_updated }`
  - Fetches current terms

#### ✅ **Privacy Policy**
- [ ] `GET /api/mobile/apps/:appId/legal/privacy`
  - Returns: `{ content, version, last_updated }`
  - Fetches current privacy policy

---

### **2. User Profile & Account (3 templates)**

#### ✅ **User Profile**
- [ ] `GET /api/mobile/apps/:appId/users/:userId/profile`
  - Returns: `{ user: { id, first_name, last_name, email, phone, bio, avatar_url, date_of_birth, gender, created_at } }`
  - Fetches user profile data

#### ✅ **Edit Profile**
- [ ] `PUT /api/mobile/apps/:appId/users/:userId/profile`
  - Body: `{ first_name, last_name, email, phone, bio, date_of_birth, gender }`
  - Returns: `{ user: { ... } }`
  - Updates user profile

- [ ] `POST /api/mobile/apps/:appId/users/:userId/profile/avatar`
  - Body: `FormData with image file`
  - Returns: `{ avatar_url }`
  - Uploads profile photo

#### ✅ **Settings**
- [ ] `GET /api/mobile/apps/:appId/users/:userId/settings`
  - Returns: `{ settings: { notifications, privacy, language, theme } }`
  - Fetches user settings

- [ ] `PUT /api/mobile/apps/:appId/users/:userId/settings`
  - Body: `{ notifications, privacy, language, theme }`
  - Returns: `{ settings: { ... } }`
  - Updates user settings

---

### **3. Main Navigation & Dashboard (2 templates)**

#### ✅ **Dashboard**
- [ ] `GET /api/mobile/apps/:appId/dashboard`
  - Returns: `{ stats: { ... }, recent_activity: [...], quick_actions: [...] }`
  - Fetches dashboard data (customizable per app)

#### ✅ **Search**
- [ ] `GET /api/mobile/apps/:appId/search?q=query&type=all`
  - Query params: `q` (search term), `type` (products|users|content|all)
  - Returns: `{ results: [...], total_count, page, per_page }`
  - Searches across app content

---

### **4. Content & Details (3 templates)**

#### ✅ **Product Details**
- [ ] `GET /api/mobile/apps/:appId/products/:productId`
  - Returns: `{ product: { id, name, description, price, images, stock, rating, reviews_count } }`
  - Fetches single product details

#### ✅ **About Us**
- [ ] `GET /api/mobile/apps/:appId/content/about`
  - Returns: `{ content, images, contact_info }`
  - Fetches about page content

#### ✅ **FAQ**
- [ ] `GET /api/mobile/apps/:appId/content/faq`
  - Returns: `{ faqs: [{ question, answer, category }] }`
  - Fetches FAQ list

---

### **5. Communication (3 templates)**

#### ✅ **Contact Form**
- [ ] `POST /api/mobile/apps/:appId/contact`
  - Body: `{ name, email, subject, message }`
  - Returns: `{ message, ticket_id }`
  - Submits contact form

#### ✅ **Chat**
- [ ] `GET /api/mobile/apps/:appId/chat/conversations`
  - Returns: `{ conversations: [{ id, participant, last_message, unread_count }] }`
  - Lists user's conversations

- [ ] `GET /api/mobile/apps/:appId/chat/conversations/:conversationId/messages`
  - Returns: `{ messages: [{ id, sender_id, content, timestamp }] }`
  - Fetches messages in conversation

- [ ] `POST /api/mobile/apps/:appId/chat/conversations/:conversationId/messages`
  - Body: `{ content }`
  - Returns: `{ message: { ... } }`
  - Sends new message

- [ ] WebSocket endpoint for real-time chat
  - `ws://api/mobile/apps/:appId/chat/ws`

#### ✅ **Write Review**
- [ ] `POST /api/mobile/apps/:appId/products/:productId/reviews`
  - Body: `{ rating, title, comment }`
  - Returns: `{ review: { ... } }`
  - Submits product review

---

### **6. E-Commerce & Shopping (4 templates)**

#### ✅ **Shopping Cart**
- [ ] `GET /api/mobile/apps/:appId/cart`
  - Returns: `{ cart: { items: [...], subtotal, tax, total } }`
  - Fetches current cart

- [ ] `POST /api/mobile/apps/:appId/cart/items`
  - Body: `{ product_id, quantity, variant_id }`
  - Returns: `{ cart: { ... } }`
  - Adds item to cart

- [ ] `PUT /api/mobile/apps/:appId/cart/items/:itemId`
  - Body: `{ quantity }`
  - Returns: `{ cart: { ... } }`
  - Updates cart item quantity

- [ ] `DELETE /api/mobile/apps/:appId/cart/items/:itemId`
  - Returns: `{ cart: { ... } }`
  - Removes item from cart

#### ✅ **Checkout**
- [ ] `POST /api/mobile/apps/:appId/checkout/validate`
  - Body: `{ shipping_address, billing_address }`
  - Returns: `{ valid, errors, shipping_options }`
  - Validates checkout data

- [ ] `POST /api/mobile/apps/:appId/checkout/calculate`
  - Body: `{ shipping_method, promo_code }`
  - Returns: `{ subtotal, shipping, tax, discount, total }`
  - Calculates order totals

#### ✅ **Payment Method**
- [ ] `GET /api/mobile/apps/:appId/payment-methods`
  - Returns: `{ payment_methods: [{ id, type, last4, brand }] }`
  - Lists saved payment methods

- [ ] `POST /api/mobile/apps/:appId/payment-methods`
  - Body: `{ type, token, billing_address }`
  - Returns: `{ payment_method: { ... } }`
  - Adds new payment method

- [ ] `DELETE /api/mobile/apps/:appId/payment-methods/:methodId`
  - Returns: `{ message }`
  - Removes payment method

#### ✅ **Order Confirmation**
- [ ] `POST /api/mobile/apps/:appId/orders`
  - Body: `{ cart_id, shipping_address, billing_address, payment_method_id }`
  - Returns: `{ order: { id, order_number, total, status, estimated_delivery } }`
  - Creates order from cart

- [ ] `GET /api/mobile/apps/:appId/orders/:orderId`
  - Returns: `{ order: { ... } }`
  - Fetches order details

---

### **7. Notifications (1 template)**

#### ✅ **Notifications List**
- [ ] `GET /api/mobile/apps/:appId/notifications`
  - Query params: `page`, `per_page`, `unread_only`
  - Returns: `{ notifications: [{ id, title, message, type, read, created_at }], unread_count }`
  - Lists user notifications

- [ ] `PUT /api/mobile/apps/:appId/notifications/:notificationId/read`
  - Returns: `{ message }`
  - Marks notification as read

- [ ] `PUT /api/mobile/apps/:appId/notifications/read-all`
  - Returns: `{ message }`
  - Marks all notifications as read

- [ ] `DELETE /api/mobile/apps/:appId/notifications/:notificationId`
  - Returns: `{ message }`
  - Deletes notification

---

### **8. Booking & Reservations (1 template)**

#### ✅ **Booking Form**
- [ ] `GET /api/mobile/apps/:appId/bookings/availability`
  - Query params: `date`, `service_id`, `duration`
  - Returns: `{ available_slots: [{ start_time, end_time, available }] }`
  - Checks availability

- [ ] `POST /api/mobile/apps/:appId/bookings`
  - Body: `{ service_id, date, time, duration, notes, customer_info }`
  - Returns: `{ booking: { id, confirmation_number, status } }`
  - Creates booking

- [ ] `GET /api/mobile/apps/:appId/bookings/:bookingId`
  - Returns: `{ booking: { ... } }`
  - Fetches booking details

- [ ] `PUT /api/mobile/apps/:appId/bookings/:bookingId/cancel`
  - Returns: `{ message }`
  - Cancels booking

---

## 🗄️ **Database Schema Requirements**

### **New Tables Needed:**

1. **`app_users`** - Users specific to each app
   ```sql
   - id (PK)
   - app_id (FK)
   - email (unique per app)
   - password_hash
   - first_name
   - last_name
   - phone
   - bio
   - avatar_url
   - date_of_birth
   - gender
   - email_verified
   - created_at
   - updated_at
   ```

2. **`user_sessions`** - JWT sessions
   ```sql
   - id (PK)
   - user_id (FK)
   - token_hash
   - expires_at
   - device_info
   - created_at
   ```

3. **`user_settings`** - User preferences
   ```sql
   - id (PK)
   - user_id (FK)
   - notifications_enabled
   - email_notifications
   - push_notifications
   - language
   - theme
   - privacy_settings (JSON)
   ```

4. **`products`** - E-commerce products
   ```sql
   - id (PK)
   - app_id (FK)
   - name
   - description
   - price
   - stock
   - images (JSON)
   - category
   - rating
   - reviews_count
   - created_at
   - updated_at
   ```

5. **`shopping_carts`** - Shopping carts
   ```sql
   - id (PK)
   - user_id (FK)
   - app_id (FK)
   - status (active, checked_out, abandoned)
   - created_at
   - updated_at
   ```

6. **`cart_items`** - Cart items
   ```sql
   - id (PK)
   - cart_id (FK)
   - product_id (FK)
   - quantity
   - variant_id
   - price_at_add
   ```

7. **`orders`** - Orders
   ```sql
   - id (PK)
   - app_id (FK)
   - user_id (FK)
   - order_number
   - status
   - subtotal
   - tax
   - shipping
   - total
   - shipping_address (JSON)
   - billing_address (JSON)
   - created_at
   - updated_at
   ```

8. **`order_items`** - Order items
   ```sql
   - id (PK)
   - order_id (FK)
   - product_id (FK)
   - quantity
   - price
   - name (snapshot)
   ```

9. **`reviews`** - Product reviews
   ```sql
   - id (PK)
   - product_id (FK)
   - user_id (FK)
   - rating
   - title
   - comment
   - created_at
   ```

10. **`notifications`** - User notifications
    ```sql
    - id (PK)
    - user_id (FK)
    - app_id (FK)
    - title
    - message
    - type
    - read
    - data (JSON)
    - created_at
    ```

11. **`bookings`** - Reservations/appointments
    ```sql
    - id (PK)
    - app_id (FK)
    - user_id (FK)
    - service_id
    - confirmation_number
    - date
    - time
    - duration
    - status
    - notes
    - customer_info (JSON)
    - created_at
    ```

12. **`chat_conversations`** - Chat conversations
    ```sql
    - id (PK)
    - app_id (FK)
    - participant1_id (FK)
    - participant2_id (FK)
    - last_message_at
    - created_at
    ```

13. **`chat_messages`** - Chat messages
    ```sql
    - id (PK)
    - conversation_id (FK)
    - sender_id (FK)
    - content
    - read
    - created_at
    ```

14. **`contact_submissions`** - Contact form submissions
    ```sql
    - id (PK)
    - app_id (FK)
    - name
    - email
    - subject
    - message
    - status
    - ticket_id
    - created_at
    ```

---

## 🔐 **Security & Middleware**

### **Authentication Middleware**
- [ ] Create `authenticateMobileUser` middleware
  - Validates JWT token
  - Extracts user_id and app_id
  - Checks token expiration
  - Verifies user belongs to app

### **Rate Limiting**
- [ ] Implement rate limiting per endpoint
  - Auth endpoints: 5 requests/minute
  - Read endpoints: 100 requests/minute
  - Write endpoints: 30 requests/minute

### **Input Validation**
- [ ] Create validation schemas for all endpoints
  - Use Joi or express-validator
  - Sanitize inputs
  - Validate data types and formats

### **Error Handling**
- [ ] Standardized error responses
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 500: Internal Server Error

---

## 📝 **Implementation Steps**

### **Phase 1: Foundation (Week 1)**
- [ ] Create database schema and migrations
- [ ] Set up authentication system (JWT)
- [ ] Create base middleware (auth, rate limiting, validation)
- [ ] Set up error handling
- [ ] Create API documentation structure

### **Phase 2: Authentication & User Management (Week 2)**
- [ ] Implement all auth endpoints (login, register, forgot password, etc.)
- [ ] Implement user profile endpoints (get, update)
- [ ] Implement user settings endpoints
- [ ] Add email verification system
- [ ] Add password reset system

### **Phase 3: Content & Navigation (Week 3)**
- [ ] Implement dashboard endpoint
- [ ] Implement search endpoint
- [ ] Implement content endpoints (about, FAQ, legal)
- [ ] Implement notifications endpoints

### **Phase 4: E-Commerce (Week 4)**
- [ ] Implement product endpoints
- [ ] Implement cart endpoints
- [ ] Implement checkout flow
- [ ] Implement order endpoints
- [ ] Implement payment integration

### **Phase 5: Communication & Booking (Week 5)**
- [ ] Implement contact form endpoint
- [ ] Implement chat endpoints
- [ ] Set up WebSocket for real-time chat
- [ ] Implement review endpoints
- [ ] Implement booking endpoints

### **Phase 6: Testing & Documentation (Week 6)**
- [ ] Write unit tests for all endpoints
- [ ] Write integration tests
- [ ] Complete API documentation
- [ ] Create Postman collection
- [ ] Performance testing and optimization

---

## 📚 **Documentation Requirements**

- [ ] API Reference documentation (Swagger/OpenAPI)
- [ ] Authentication guide
- [ ] Integration examples for React Native
- [ ] Error codes reference
- [ ] Rate limiting documentation
- [ ] Postman collection with example requests

---

## 🧪 **Testing Requirements**

- [ ] Unit tests for all controllers
- [ ] Integration tests for all endpoints
- [ ] Authentication flow tests
- [ ] E-commerce flow tests (cart → checkout → order)
- [ ] Chat functionality tests
- [ ] Load testing for high-traffic endpoints

---

## 📊 **Success Metrics**

- [ ] All 26 templates have corresponding API endpoints
- [ ] 100% test coverage on critical paths
- [ ] API response time < 200ms (95th percentile)
- [ ] Complete API documentation
- [ ] Zero critical security vulnerabilities

---

## 🚀 **Next Steps**

1. Review and approve this plan
2. Set up development environment
3. Create database migrations
4. Start with Phase 1 (Foundation)
5. Implement endpoints incrementally
6. Test each endpoint before moving to next
7. Document as you build

---

**Estimated Timeline:** 6 weeks
**Priority:** High - Required before adding more templates
**Dependencies:** None - can start immediately
