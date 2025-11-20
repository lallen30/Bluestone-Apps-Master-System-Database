# Property Listing App - Screen Access Matrix

## Complete Screen-by-Screen Access Guide

This matrix shows exactly which screens each role can access in your AirPnP property listing app.

---

## 📱 Screen Access Matrix

| # | Screen Name | Guest | Renter | Host | Premium | Verified | Category |
|---|-------------|-------|--------|------|---------|----------|----------|
| 1 | Splash Screen | ✅ | ✅ | ✅ | ✅ | ✅ | Auth |
| 2 | Login Screen | ✅ | ✅ | ✅ | ✅ | ✅ | Auth |
| 3 | Sign Up | ✅ | ✅ | ✅ | ✅ | ✅ | Auth |
| 4 | Forgot Password | ✅ | ✅ | ✅ | ✅ | ✅ | Auth |
| 5 | Email Verification | ✅ | ✅ | ✅ | ✅ | ✅ | Auth |
| 6 | Property Listings | ✅ | ✅ | ✅ | ✅ | ✅ | Browse |
| 7 | Property Details | ✅ | ✅ | ✅ | ✅ | ✅ | Browse |
| 8 | Advanced Search | ✅ | ✅ | ✅ | ✅ | ✅ | Browse |
| 9 | Host Profile | ✅ | ✅ | ✅ | ✅ | ✅ | Browse |
| 10 | Reviews & Ratings | ✅ | ✅ | ✅ | ✅ | ✅ | Browse |
| 11 | About Us | ✅ | ✅ | ✅ | ✅ | ✅ | Info |
| 12 | Privacy Policy | ✅ | ✅ | ✅ | ✅ | ✅ | Info |
| 13 | Terms of Service | ✅ | ✅ | ✅ | ✅ | ✅ | Info |
| 14 | Contact Us | ✅ | ✅ | ✅ | ✅ | ✅ | Info |
| 15 | **Booking Form** | ❌ | ✅ | ✅ | ✅ | ✅ | **Booking** |
| 16 | **User Profile** | ❌ | ✅ | ✅ | ✅ | ✅ | **Account** |
| 17 | **Edit Profile** | ❌ | ✅ | ✅ | ✅ | ✅ | **Account** |
| 18 | **Messages** | ❌ | ✅ | ✅ | ✅ | ✅ | **Communication** |
| 19 | **Notifications** | ❌ | ✅ | ✅ | ✅ | ✅ | **Communication** |

**Legend**:
- ✅ = Can access
- ❌ = Cannot access
- **Bold** = Key differentiating screens

---

## 🎯 Key Differences Between Roles

### Guest vs Renter
**What Guests CANNOT do** (but Renters can):
- ❌ Book properties (no Booking Form)
- ❌ View/edit their profile
- ❌ Message hosts
- ❌ Receive notifications
- ❌ Submit reviews (view only)

**Upgrade Path**: Guest → Renter (adds 5 screens)

---

### Renter vs Host
**Current**: Same screen access (19 screens each)

**Future** (when host features are added):
- ✅ Property Management Dashboard
- ✅ Add/Edit Property Listings
- ✅ Booking Requests Management
- ✅ Host Analytics & Reports
- ✅ Payout Settings
- ✅ Calendar Management

**Upgrade Path**: Renter → Host (adds host management features)

---

### Renter vs Premium Renter
**Current**: Same screen access (19 screens each)

**Future** (when premium features are added):
- ✅ Exclusive Properties Section
- ✅ Priority Customer Support
- ✅ Advanced Booking Options
- ✅ No Booking Fees
- ✅ Early Access to New Features
- ✅ Premium Badge on Profile

**Upgrade Path**: Renter → Premium (adds premium benefits)

---

### Renter vs Verified User
**Current**: Same screen access (19 screens each)

**Future** (when verification features are added):
- ✅ Instant Booking (no host approval needed)
- ✅ Verified Badge Display
- ✅ Access to Verification-Required Properties
- ✅ Enhanced Trust Score
- ✅ Priority in Booking Requests

**Upgrade Path**: Renter → Verified (adds trust features)

---

## 📊 Screen Categories Breakdown

### 🔐 Authentication Screens (5 screens)
**Access**: Everyone (all roles)
- Splash Screen
- Login Screen
- Sign Up
- Forgot Password
- Email Verification

**Purpose**: Account creation and access

---

### 🏠 Property Browsing Screens (5 screens)
**Access**: Everyone (all roles)
- Property Listings
- Property Details
- Advanced Search
- Host Profile
- Reviews & Ratings

**Purpose**: Discover and research properties

---

### ℹ️ Information Screens (4 screens)
**Access**: Everyone (all roles)
- About Us
- Privacy Policy
- Terms of Service
- Contact Us

**Purpose**: Legal, support, and company info

---

### 📅 Booking Screens (1 screen)
**Access**: Renter, Host, Premium, Verified only
- **Booking Form** ⭐

**Purpose**: Reserve properties

**Why Restricted**: 
- Prevents spam bookings
- Requires user accountability
- Needs verified contact info

---

### 👤 Account Management Screens (2 screens)
**Access**: Renter, Host, Premium, Verified only
- **User Profile**
- **Edit Profile**

**Purpose**: Manage personal information

**Why Restricted**:
- Guests don't need profiles
- Only active users need accounts
- Reduces database clutter

---

### 💬 Communication Screens (2 screens)
**Access**: Renter, Host, Premium, Verified only
- **Messages** ⭐
- **Notifications** ⭐

**Purpose**: Host-guest communication and updates

**Why Restricted**:
- Only booking users need to message
- Prevents spam and abuse
- Maintains quality communication

---

## 🚦 Access Control Logic

### Booking Form Access
```javascript
function canAccessBookingForm(user) {
  return user.hasAnyRole([
    'renter',
    'host',
    'premium_renter',
    'verified_user'
  ]);
}

// If false, show:
// "Sign up as a Renter to book properties"
```

### Messages Access
```javascript
function canAccessMessages(user) {
  return user.hasAnyRole([
    'renter',
    'host',
    'premium_renter',
    'verified_user'
  ]);
}

// If false, show:
// "Create an account to message hosts"
```

### Profile Access
```javascript
function canAccessProfile(user) {
  return user.hasAnyRole([
    'renter',
    'host',
    'premium_renter',
    'verified_user'
  ]);
}

// If false, show:
// "Sign up to create your profile"
```

---

## 🎨 User Experience by Role

### 👤 Guest Experience
```
Home → Property Listings → Property Details → [Sign up to book]
                                            ↓
                                    Create Account
                                            ↓
                                    Upgrade to Renter
```

**Navigation Available**:
- Browse
- Search
- View Details
- Read Reviews
- View Host Profiles
- Contact Support

**Navigation Hidden**:
- Book Now (shows "Sign up to book")
- My Profile
- Messages
- Notifications

---

### 🏠 Renter Experience
```
Home → Property Listings → Property Details → Book Now → Booking Form
                                                              ↓
                                                        Confirmation
                                                              ↓
                                                          Messages
```

**Navigation Available**:
- Everything Guest has
- **Book Now** (active button)
- **My Profile**
- **Messages** (with hosts)
- **Notifications** (booking updates)

**New Features**:
- Can submit reviews after stays
- Can save favorite properties
- Can track booking history

---

### 🏡 Host Experience
```
Home → My Properties → Add Property → Manage Bookings → Messages
                                                            ↓
                                                    Guest Communication
```

**Navigation Available**:
- Everything Renter has
- **My Properties** (when added)
- **Add Property** (when added)
- **Booking Requests** (when added)
- **Host Dashboard** (when added)

**New Features**:
- List properties
- Manage availability
- Set pricing
- View analytics
- Respond to bookings

---

## 📱 Mobile App Navigation Structure

### Guest Navigation
```
┌─────────────────────┐
│      Browse         │ ← Home
├─────────────────────┤
│      Search         │
├─────────────────────┤
│      Saved          │ (Empty, prompts signup)
├─────────────────────┤
│      Profile        │ (Shows login/signup)
└─────────────────────┘
```

### Renter Navigation
```
┌─────────────────────┐
│      Browse         │ ← Home
├─────────────────────┤
│      Search         │
├─────────────────────┤
│      Bookings       │ ← NEW
├─────────────────────┤
│      Messages       │ ← NEW
├─────────────────────┤
│      Profile        │ ← NEW (Full access)
└─────────────────────┘
```

### Host Navigation
```
┌─────────────────────┐
│      Browse         │
├─────────────────────┤
│      My Properties  │ ← NEW
├─────────────────────┤
│      Bookings       │ (Both as guest & host)
├─────────────────────┤
│      Messages       │ (Enhanced)
├─────────────────────┤
│      Profile        │ (Host profile)
└─────────────────────┘
```

---

## 🔄 Role Transition Examples

### Example 1: Guest → Renter
**Trigger**: User clicks "Book Now"

**Flow**:
1. User sees "Sign up to book" message
2. User creates account (auto-assigned Guest role)
3. Admin assigns Renter role
4. User can now access booking form
5. User completes first booking

**Screen Changes**:
- Booking Form: ❌ → ✅
- User Profile: ❌ → ✅
- Messages: ❌ → ✅
- Notifications: ❌ → ✅

---

### Example 2: Renter → Host
**Trigger**: User clicks "Become a Host"

**Flow**:
1. User fills host application
2. Admin reviews application
3. Admin assigns Host role
4. User keeps Renter role + gets Host role
5. User can now list properties

**Screen Changes**:
- Property Management: ❌ → ✅ (when added)
- Host Dashboard: ❌ → ✅ (when added)
- Booking Requests: ❌ → ✅ (when added)

---

### Example 3: Renter → Premium
**Trigger**: User subscribes to Premium

**Flow**:
1. User clicks "Upgrade to Premium"
2. User completes payment
3. Payment webhook assigns Premium role
4. User keeps Renter role + gets Premium role
5. User gets premium benefits

**Screen Changes**:
- Exclusive Properties: ❌ → ✅ (when added)
- Priority Support: ❌ → ✅ (when added)
- Premium Badge: ❌ → ✅ (when added)

---

## ✅ Summary

### Screen Count by Role:
- **Guest**: 14 screens (public only)
- **Renter**: 19 screens (public + booking)
- **Host**: 19 screens (+ host features when added)
- **Premium**: 19 screens (+ premium features when added)
- **Verified**: 19 screens (+ verification features when added)

### Key Takeaways:
1. ✅ Guests can browse but not book
2. ✅ Renters can book and communicate
3. ✅ Hosts can list and manage properties
4. ✅ Premium gets enhanced features
5. ✅ Verified gets instant booking

### Access Control:
- 🔓 **14 screens** = Public (everyone)
- 🔒 **5 screens** = Authenticated users only (Renter+)
- 🔐 **Future screens** = Role-specific (Host, Premium, Verified)

---

## 🎯 Next Steps

1. Visit http://localhost:3001/app/28/roles to see all roles
2. Test Guest access (14 screens)
3. Assign Renter role to a test user
4. Verify they can access all 19 screens
5. Build host-specific screens when ready
6. Add premium features as needed

Your property listing app now has a complete, Airbnb-style role structure! 🎉
