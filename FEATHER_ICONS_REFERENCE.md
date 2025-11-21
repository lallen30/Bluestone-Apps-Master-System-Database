# Feather Icons Reference for Tab Bar

**Icon Library:** [Feather Icons](https://feathericons.com/)  
**React Native Package:** `react-native-vector-icons/Feather`

---

## 🎯 **Recommended Tab Bar Icons**

### **Common App Screens:**

| Screen Type | Icon Name | Visual |
|-------------|-----------|--------|
| **Search/Explore** | `search` | 🔍 |
| **Home/Feed** | `home` | 🏠 |
| **Bookings/Calendar** | `calendar` | 📅 |
| **Messages/Chat** | `message-square` | 💬 |
| **Messages (Alt)** | `message-circle` | 💭 |
| **Inbox** | `inbox` | 📥 |
| **Notifications** | `bell` | 🔔 |
| **Profile/User** | `user` | 👤 |
| **Settings** | `settings` | ⚙️ |
| **Favorites/Heart** | `heart` | ❤️ |
| **Star/Featured** | `star` | ⭐ |
| **Map/Location** | `map-pin` | 📍 |
| **Camera/Photos** | `camera` | 📷 |
| **Shopping/Cart** | `shopping-cart` | 🛒 |
| **List/Menu** | `list` | 📋 |
| **Grid/Apps** | `grid` | ⊞ |

---

## 📱 **Current Tab Bar Configuration (App 28)**

| Order | Screen | Label | Icon | Status |
|-------|--------|-------|------|--------|
| 1 | Search Properties | Search | `search` | ✅ Valid |
| 2 | My Bookings | Bookings | `calendar` | ✅ Valid |
| 3 | Messages | Messages | `message-square` | ✅ Valid |

---

## 🔧 **How to Update Tab Bar Icons**

### **Via Admin Portal:**
1. Go to `http://localhost:3001/app/28/menus/7`
2. Click on a menu item
3. Change the icon field
4. Save

### **Via SQL:**
```sql
-- Update a menu item icon
UPDATE menu_items 
SET icon = 'message-square'
WHERE id = 24;
```

---

## ✅ **Valid Feather Icon Names**

### **Navigation & UI:**
- `home`, `menu`, `more-horizontal`, `more-vertical`
- `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`
- `chevron-left`, `chevron-right`, `chevron-up`, `chevron-down`
- `x`, `plus`, `minus`, `check`

### **Communication:**
- `message-square`, `message-circle`, `mail`, `inbox`
- `send`, `phone`, `phone-call`, `video`

### **User & Profile:**
- `user`, `users`, `user-plus`, `user-check`
- `settings`, `sliders`, `edit`, `edit-2`, `edit-3`

### **Content:**
- `file`, `file-text`, `folder`, `image`
- `camera`, `video`, `music`, `book`

### **Actions:**
- `heart`, `star`, `bookmark`, `share`, `share-2`
- `download`, `upload`, `trash`, `trash-2`
- `copy`, `save`, `printer`

### **Commerce:**
- `shopping-cart`, `shopping-bag`, `credit-card`
- `dollar-sign`, `tag`, `package`

### **Time & Calendar:**
- `calendar`, `clock`, `watch`

### **Location:**
- `map`, `map-pin`, `navigation`, `compass`

### **Search & Filter:**
- `search`, `filter`, `eye`, `eye-off`

### **Alerts:**
- `bell`, `alert-circle`, `alert-triangle`, `info`

---

## 🚫 **Common Mistakes**

❌ **Invalid Icons:**
- `list` (use for lists, not messages)
- `message` (doesn't exist, use `message-square`)
- `msg` (doesn't exist)
- `chat` (doesn't exist, use `message-square`)

✅ **Correct Alternatives:**
- Messages: `message-square` or `message-circle`
- Lists: `list` or `align-justify`
- Chat: `message-square`

---

## 🔍 **Testing Icons**

To test if an icon exists:
1. Visit https://feathericons.com/
2. Search for the icon name
3. If it appears, it's valid!

Or check the React Native app console for errors like:
```
⚠️ Icon 'invalid-name' not found in Feather icon set
```

---

## 📝 **Notes**

- Icon names are **case-sensitive** and use **kebab-case**
- All icons are **outline style** (no filled versions)
- Icons automatically scale based on tab bar size
- Icons change color based on active/inactive state

---

**Last Updated:** November 20, 2025  
**App:** Property Rental (ID: 28)
