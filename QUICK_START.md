# FarmHawk - Quick Start Guide

## 🚀 Getting Started

### Prerequisites

- Node.js v14 or higher
- npm or yarn package manager

### Installation Steps

1. **Navigate to project directory**

```bash
cd farmhawk
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

4. **Open in browser**

```
http://localhost:5173
```

---

## 🔐 Demo Credentials

### Account 1 (Raj Kumar)

```
Email:    farmer1@farmhawk.com
Password: password123
Name:     राज कुमार
Region:   हरियाणा
```

### Account 2 (Priya Sharma)

```
Email:    farmer2@farmhawk.com
Password: password123
Name:     प्रिया शर्मा
Region:   पंजाब
```

---

## 📖 User Guide

### 1️⃣ Login

- Enter your email and password
- Check "Remember Me" to stay logged in
- Click "Sign In" to proceed

### 2️⃣ Dashboard Overview

- View statistics (total area, crops, drone status)
- Check real-time drone metrics (battery, altitude, speed)
- Monitor 24-hour auto-launch countdown
- Review historical scan history
- See upcoming scans

### 3️⃣ Manage Fields

Navigate to **"Farmer Data"** in the menu:

- ➕ Add new fields
- ✏️ Edit existing fields
- ❌ Delete fields
- Track total area and crop count

**Requirements per field:**

- Field name (e.g., "Northern Field")
- Crop type (e.g., "Wheat", "Rice", "Corn")
- Land area in km² (e.g., 2.5)

### 4️⃣ Farmer Profile

Navigate to **"Profile"** in the menu:

- View your current information
- ✏️ Edit your details
- Update phone and location
- Save changes

### 5️⃣ Drone Settings

Navigate to **"Drone Settings"** in the menu:

**Set Daily Scan Time:**

- Choose the time your drone will scan (24-hour format)
- Example: 06:00 AM for early morning scans

**Configure Auto-Launch Timer:**

- Set hours before scan (0-24)
- Set minutes before scan (0-59)
- Total time before drone launches automatically

**Coverage Limits:**

- Your drone covers 5 km² per flight
- Multiple flights needed for larger areas

### 6️⃣ Language Selection

- Click language selector in **top right** (हिन्दी/English)
- All UI text updates instantly
- Preference is automatically saved

### 7️⃣ Logout

- Click **"Logout"** button in navigation
- Returns to login page
- Session is cleared (unless "Remember Me" was checked)

---

## 🎨 Design Highlights

### Color Scheme

```
Primary:      #1b5e20 (Dark Green)
Secondary:    #2d7f3e (Light Green)
Accent:       #0d3b1a (Dark Accent)
Background:   #ffffff (White)
Success:      #4caf50 (Green)
Alert:        #f57c00 (Orange)
Danger:       #d32f2f (Red)
```

### Features

- ✨ Professional dark green & white theme
- 📱 Fully responsive design
- ♿ WCAG AAA accessibility compliant
- 🎯 Smooth animations and transitions
- 🌍 Multilingual support (Hindi/English)
- 💾 Data persistence with localStorage

---

## 📊 Dashboard Walkthrough

### Statistics Cards

- **Total Area**: Sum of all your fields
- **Number of Crops**: Count of different crop types
- **Drone Status**: Active or Inactive
- **Pending Scans**: Fields awaiting scan

### Drone Status Widget

- **Battery**: Current charge percentage with progress bar
- **Altitude**: Current height in meters
- **Speed**: Flight speed in km/h
- **Status**: Flying or Idle indicator

### Timer Section

- **24-Hour Countdown**: Live countdown before auto-launch
- **Format**: Hours:Minutes:Seconds
- **Updates**: Every second in real-time

### Scan History

- **Recent Scans**: List of past scan operations
- **Status**: Completed or Ongoing
- **Duration**: Time taken for each scan
- **Field Info**: Which field was scanned

### My Fields

- **Field Cards**: View all your registered fields
- **Quick Info**: See crop type and area
- **Manage**: Edit or delete fields

---

## 🛠️ Available Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint to check code quality
npm run lint
```

---

## 📱 Mobile Usage

### Mobile-Friendly Features

- ✓ Touch-optimized buttons
- ✓ Responsive navigation menu
- ✓ Single-column layouts
- ✓ Optimized font sizes
- ✓ Full functionality on small screens

### Mobile Menu

- Tap **≡ menu icon** to open navigation
- Tap menu items to navigate
- Tap again to close menu

---

## ⌨️ Keyboard Navigation

### Navigation Keys

- **Tab**: Move to next element
- **Shift + Tab**: Move to previous element
- **Enter**: Activate focused button
- **Esc**: Close modals/menus
- **Arrow Keys**: Navigate dropdowns

---

## 🔍 Troubleshooting

### Issue: Login not working

**Solution:** Ensure you're using correct demo credentials:

- farmer1@farmhawk.com / password123
- farmer2@farmhawk.com / password123

### Issue: Language not changing

**Solution:** Click the language button (हिन्दी/English) in top-right corner

### Issue: Settings not saving

**Solution:** Clear browser cache and reload:

- Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
- Clear all data
- Refresh page

### Issue: Timer not updating

**Solution:** Refresh the dashboard page in your browser

### Issue: Drone Status not showing

**Solution:** This is a demo feature. Make sure you have fields added to your profile.

---

## 📚 Additional Resources

### Documentation Files

- **README.md** - Full project documentation
- **DESIGN_SYSTEM.md** - Color palette and design guidelines
- **FEATURES.md** - Detailed feature list
- **DEVELOP.md** - Development guide (coming soon)

### External Links

- [React Documentation](https://react.dev)
- [i18next Documentation](https://www.i18next.com)
- [Vite Guide](https://vitejs.dev)

---

## 💡 Tips & Tricks

### ✨ Pro Tips

1. **Add multiple fields** to track different crop areas
2. **Set early scan time** for better crop monitoring
3. **Use Hindi language** for complete localization
4. **Check drone status** regularly for battery updates
5. **Review scan history** to track monitoring activity

### 🔒 Data Privacy

- All data stored locally in browser
- No cloud transmission
- No third-party tracking
- Secure logout clears session

---

## 🤝 Support

### Getting Help

- Check documentation in the app
- Review error messages for guidance
- Try the troubleshooting section above

### Reporting Issues

- Document the issue clearly
- Note your browser and device
- Include steps to reproduce

---

## 📝 Notes

### Current Version

- **Version**: 2.0
- **Release Date**: August 2026
- **Status**: Stable

### Limitations

- Demo data only (no real drone integration yet)
- Mock scan history for demonstration
- Browser storage limited to device

### Planned Features

- Real drone API integration
- Advanced analytics dashboard
- Weather integration
- Crop health analysis
- Multi-language support (Punjabi, Marathi)

---

**Happy Farming! 🌾**  
_FarmHawk - Precision Agriculture Monitoring_
