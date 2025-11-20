# Property Listing App - Recommended Role Structure

## App: AirPnP (ID: 28)
**Type**: Property rental marketplace (similar to Airbnb)

---

## 🎯 Recommended User Roles

### 1. **Guest** (Default Role)
**Purpose**: Browsing users who haven't booked yet or casual browsers

**Access Level**: View-only, basic browsing

**Screen Access**:
- ✅ Splash Screen
- ✅ Login Screen
- ✅ Sign Up
- ✅ Forgot Password
- ✅ Email Verification
- ✅ Property Listings (browse)
- ✅ Property Details (view)
- ✅ Advanced Search
- ✅ Host Profile (view)
- ✅ Reviews & Ratings (view only)
- ✅ About Us
- ✅ Privacy Policy
- ✅ Terms of Service
- ✅ Contact Us
- ❌ Booking Form (must upgrade to Renter)
- ❌ User Profile
- ❌ Edit Profile
- ❌ Messages
- ❌ Notifications

**Use Case**: New users, window shoppers, people researching properties

---

### 2. **Renter** (Booking User)
**Purpose**: Users who can book properties

**Access Level**: Full guest access + booking capabilities

**Screen Access**:
- ✅ All Guest screens
- ✅ **Booking Form** (NEW)
- ✅ **User Profile** (NEW)
- ✅ **Edit Profile** (NEW)
- ✅ **Messages** (NEW - communicate with hosts)
- ✅ **Notifications** (NEW - booking confirmations, updates)
- ❌ Host-specific features

**Use Case**: Travelers, people booking stays, active customers

---

### 3. **Host** (Property Owner)
**Purpose**: Users who list and manage properties

**Access Level**: All Renter access + property management

**Screen Access**:
- ✅ All Renter screens
- ✅ **Property Management Dashboard** (if exists)
- ✅ **Add/Edit Property Listings** (if exists)
- ✅ **Booking Management** (if exists)
- ✅ **Host Analytics** (if exists)
- ✅ Enhanced Messages (manage multiple conversations)
- ✅ Enhanced Notifications (booking requests, reviews)

**Use Case**: Property owners, landlords, hosts managing rentals

---

### 4. **Premium Renter** (Optional)
**Purpose**: Paying subscribers with enhanced features

**Access Level**: All Renter access + premium benefits

**Screen Access**:
- ✅ All Renter screens
- ✅ **Priority Booking** (if exists)
- ✅ **Exclusive Properties** (if exists)
- ✅ **Advanced Filters** (enhanced search)
- ✅ **No Booking Fees** (if applicable)
- ✅ **24/7 Support** (if exists)

**Use Case**: Frequent travelers, business travelers, loyal customers

---

### 5. **Verified User** (Optional)
**Purpose**: Users who have completed identity verification

**Access Level**: Enhanced trust and access

**Screen Access**:
- ✅ All Renter screens
- ✅ **Instant Booking** (if exists)
- ✅ **Verified Badge** on profile
- ✅ Access to properties that require verification

**Use Case**: Trusted users, ID-verified travelers

---

## 📊 Role Comparison Matrix

| Screen | Guest | Renter | Host | Premium | Verified |
|--------|-------|--------|------|---------|----------|
| **Public Screens** |
| Splash Screen | ✅ | ✅ | ✅ | ✅ | ✅ |
| Login/Signup | ✅ | ✅ | ✅ | ✅ | ✅ |
| Property Listings | ✅ | ✅ | ✅ | ✅ | ✅ |
| Property Details | ✅ | ✅ | ✅ | ✅ | ✅ |
| Advanced Search | ✅ | ✅ | ✅ | ✅ | ✅ |
| Host Profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reviews (View) | ✅ | ✅ | ✅ | ✅ | ✅ |
| About/Privacy/Terms | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Booking Features** |
| Booking Form | ❌ | ✅ | ✅ | ✅ | ✅ |
| User Profile | ❌ | ✅ | ✅ | ✅ | ✅ |
| Edit Profile | ❌ | ✅ | ✅ | ✅ | ✅ |
| Messages | ❌ | ✅ | ✅ | ✅ | ✅ |
| Notifications | ❌ | ✅ | ✅ | ✅ | ✅ |
| Reviews (Submit) | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Host Features** |
| Property Management | ❌ | ❌ | ✅ | ❌ | ❌ |
| Host Dashboard | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Premium Features** |
| Exclusive Properties | ❌ | ❌ | ❌ | ✅ | ❌ |
| Priority Support | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Verified Features** |
| Instant Booking | ❌ | ❌ | ❌ | ❌ | ✅ |
| Verified Badge | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🚀 Implementation Steps

### Phase 1: Basic Roles (Start Here)

#### 1. Create "Guest" Role (Default)
```
Name: guest
Display Name: Guest
Description: Browse properties without booking
Default Role: ✅ YES
```

**Assign Screens**:
- Splash Screen ✅
- Login Screen ✅
- Sign Up ✅
- Forgot Password ✅
- Email Verification ✅
- Property Listings ✅
- Property Details ✅
- Advanced Search ✅
- Host Profile ✅
- Reviews & Ratings ✅
- About Us ✅
- Privacy Policy ✅
- Terms of Service ✅
- Contact Us ✅

#### 2. Create "Renter" Role
```
Name: renter
Display Name: Renter
Description: Book properties and manage reservations
Default Role: ❌ NO
```

**Assign Screens** (All Guest screens PLUS):
- Booking Form ✅
- User Profile ✅
- Edit Profile ✅
- Messages ✅
- Notifications ✅

#### 3. Create "Host" Role
```
Name: host
Display Name: Host
Description: List and manage properties
Default Role: ❌ NO
```

**Assign Screens** (All Renter screens PLUS):
- Any host-specific screens when created

---

### Phase 2: Advanced Roles (Optional)

#### 4. Create "Premium Renter" Role
```
Name: premium_renter
Display Name: Premium Renter
Description: Enhanced features and exclusive access
Default Role: ❌ NO
```

#### 5. Create "Verified User" Role
```
Name: verified_user
Display Name: Verified User
Description: ID-verified users with instant booking
Default Role: ❌ NO
```

---

## 🎭 User Journey Examples

### Example 1: New User → Renter
1. **User signs up** → Automatically gets "Guest" role
2. **User browses properties** → Can view everything
3. **User tries to book** → Prompted to upgrade to "Renter"
4. **Admin assigns "Renter" role** → User can now book
5. **User completes booking** → Full access to booking features

### Example 2: Renter → Host
1. **User is a Renter** → Can book properties
2. **User wants to list property** → Requests Host access
3. **Admin assigns "Host" role** → User keeps Renter access + Host features
4. **User has both roles** → Can book AND list properties

### Example 3: Guest → Premium
1. **User is a Guest** → Browsing only
2. **User subscribes to Premium** → Admin assigns "Premium Renter" role
3. **User gets enhanced access** → Exclusive properties, priority support
4. **Subscription expires** → Admin removes "Premium Renter" role

---

## 🔐 Access Control Logic

### Booking Form Access
```
IF user.hasRole('renter') OR user.hasRole('host') OR user.hasRole('premium_renter')
  THEN show booking form
ELSE
  THEN show "Sign up to book" message
```

### Property Management Access
```
IF user.hasRole('host')
  THEN show property management features
ELSE
  THEN hide property management features
```

### Instant Booking Access
```
IF user.hasRole('verified_user') OR user.hasRole('premium_renter')
  THEN allow instant booking
ELSE
  THEN require host approval
```

---

## 💡 Best Practices

### 1. **Start Simple**
- Begin with just Guest and Renter roles
- Add Host role when property management features are ready
- Add Premium/Verified roles later as needed

### 2. **Clear Upgrade Path**
- Make it obvious how to upgrade from Guest to Renter
- Show "Upgrade to book" CTAs on booking form
- Provide self-service upgrade if possible

### 3. **Multiple Roles**
- Users can have multiple roles (e.g., Renter + Host)
- Don't force users to choose between booking and hosting
- Roles are additive, not exclusive

### 4. **Default Role**
- Only "Guest" should be the default role
- All new users start as guests
- Require action to become Renter or Host

### 5. **Role Names**
- Use clear, user-friendly display names
- Keep internal names lowercase and simple
- Avoid technical jargon

---

## 📱 Mobile App Behavior

### Guest Users See:
- Browse properties
- View details and photos
- Read reviews
- Search and filter
- "Sign up to book" CTAs

### Renter Users See:
- Everything guests see
- "Book Now" buttons
- Their profile and bookings
- Messages with hosts
- Booking confirmations

### Host Users See:
- Everything renters see
- Property management tools
- Booking requests
- Host dashboard
- Analytics (if available)

---

## 🔄 Role Transition Workflows

### Guest → Renter (Automatic)
```
1. User clicks "Book Now"
2. If not logged in → Redirect to signup
3. After signup → Auto-assign "Renter" role
4. Redirect back to booking form
```

### Renter → Host (Manual)
```
1. User clicks "Become a Host"
2. User fills out host application
3. Admin reviews application
4. Admin assigns "Host" role
5. User gets access to host features
```

### Renter → Premium (Payment)
```
1. User clicks "Upgrade to Premium"
2. User completes payment
3. Payment webhook triggers role assignment
4. System assigns "Premium Renter" role
5. User gets premium features
```

---

## 📋 Implementation Checklist

### Initial Setup
- [ ] Create "Guest" role (default)
- [ ] Create "Renter" role
- [ ] Assign screens to Guest role
- [ ] Assign screens to Renter role
- [ ] Test guest browsing
- [ ] Test renter booking

### Host Features
- [ ] Create "Host" role
- [ ] Build host dashboard screens
- [ ] Assign host screens to Host role
- [ ] Test host property management
- [ ] Test dual Renter + Host access

### Premium Features (Optional)
- [ ] Create "Premium Renter" role
- [ ] Build premium-only screens
- [ ] Implement payment integration
- [ ] Auto-assign role on payment
- [ ] Test premium features

### Verification (Optional)
- [ ] Create "Verified User" role
- [ ] Build verification flow
- [ ] Implement ID verification
- [ ] Auto-assign role on verification
- [ ] Test verified features

---

## 🎯 Quick Start Commands

### Create Guest Role
```bash
# Via Admin Portal
1. Go to http://localhost:3001/app/28/roles
2. Click "Create Role"
3. Name: guest
4. Display Name: Guest
5. Description: Browse properties without booking
6. Check "Default role"
7. Click "Create Role"
8. Assign all public screens
```

### Create Renter Role
```bash
# Via Admin Portal
1. Go to http://localhost:3001/app/28/roles
2. Click "Create Role"
3. Name: renter
4. Display Name: Renter
5. Description: Book properties and manage reservations
6. Uncheck "Default role"
7. Click "Create Role"
8. Assign all public screens + booking screens
```

---

## 📞 Summary

**Minimum Viable Roles** (Start with these):
1. ✅ **Guest** (default) - Browse only
2. ✅ **Renter** - Browse + Book

**Recommended Additions**:
3. ✅ **Host** - Browse + Book + List properties

**Optional Enhancements**:
4. ⭐ **Premium Renter** - Enhanced features
5. ⭐ **Verified User** - Instant booking

This structure provides a clear progression path for users while maintaining security and appropriate access control for your property rental marketplace.
