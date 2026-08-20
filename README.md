# FarmHawk - Precision Drone Monitoring for Modern Farming

FarmHawk is a comprehensive web-based platform designed for farmers to manage their agricultural land and drone monitoring operations. The application provides features for field management, drone settings configuration, and real-time monitoring with a 24-hour countdown timer.

## Features

### 🌾 Farmer Management

- **Farmer Registration & Login**: Secure authentication system for farmers
- **Profile Management**: Update personal information (name, phone, location)
- **Field Management**: Add, edit, and delete multiple fields with crop information

### 🚁 Drone Features

- **Drone Coverage Tracking**: Supports 5 km² coverage per flight
- **Scheduled Scanning**: Set daily scan times for automated field monitoring
- **24-Hour Auto-Launch Timer**: Automated countdown timer before drone takes off
- **Field Monitoring**: Real-time status of pending and completed scans

### 📊 Dashboard

- **Overview Statistics**: Total area, number of crops, drone status
- **Field Summary**: Quick view of all registered fields
- **Auto-Launch Countdown**: Live 24-hour timer display
- **Scan Schedule Information**: Current scan time and coverage details

### 🌐 Multilingual Support

- **Hindi & English**: Default language is Hindi with option to switch to English
- **Language Persistence**: Selected language is saved in local storage
- **Easy Language Toggle**: Language selector in navigation bar

### 📱 Responsive Design

- Mobile-friendly interface
- Touch-optimized controls
- Adaptive layouts for all screen sizes

## Tech Stack

- **Frontend Framework**: React 19.2.8
- **Routing**: React Router v6
- **Internationalization**: i18next & react-i18next
- **Build Tool**: Vite 8.2.0
- **Icons**: Lucide React
- **Styling**: CSS3 with CSS Variables
- **State Management**: React Context API

## Project Structure

```
farmhawk/
├── src/
│   ├── pages/
│   │   ├── Login.jsx              # Login page with demo credentials
│   │   ├── Dashboard.jsx          # Main dashboard with overview
│   │   ├── Profile.jsx            # Farmer profile management
│   │   ├── DroneSettings.jsx      # Drone configuration & timer settings
│   │   └── FieldManagement.jsx    # Field information management
│   ├── components/
│   │   └── Navbar.jsx             # Navigation bar with language selector
│   ├── context/
│   │   └── AuthContext.jsx        # Authentication context provider
│   ├── i18n/
│   │   ├── index.js               # i18next configuration
│   │   └── locales/
│   │       ├── en.json            # English translations
│   │       └── hi.json            # Hindi translations
│   ├── styles/
│   │   ├── global.css             # Global styles
│   │   ├── Navbar.css
│   │   ├── Login.css
│   │   ├── Dashboard.css
│   │   ├── Profile.css
│   │   ├── DroneSettings.css
│   │   └── FieldManagement.css
│   ├── App.jsx                    # Main app with routing
│   └── main.jsx                   # React entry point
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:

```bash
cd farmhawk
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to:

```
http://localhost:5173
```

### Demo Credentials

For testing purposes, use these credentials:

**User 1:**

- Email: farmer1@farmhawk.com
- Password: password123

**User 2:**

- Email: farmer2@farmhawk.com
- Password: password123

## Usage Guide

### 1. Login

- Enter your email and password
- Click "Sign In" to proceed
- The app remembers your login if you check "Remember Me"

### 2. Dashboard

- View overview of your fields and drone status
- Monitor the 24-hour auto-launch countdown timer
- See upcoming scans and drone status

### 3. Manage Fields

- Click on "Farmer Data" in the navigation
- Add new fields with name, crop type, and area
- Edit or delete existing fields
- Monitor total area and scan coverage

### 4. Farmer Profile

- Update your personal information
- Manage contact details and location
- View or edit profile at any time

### 5. Drone Settings

- Set the daily scan time (e.g., 6:00 AM)
- Configure the auto-launch timer (hours and minutes)
- Timer starts the countdown before scheduled scan
- Monitor drone coverage limits

### 6. Language Selection

- Click the language selector (हिन्दी/English) in navbar
- Your preference is automatically saved
- All UI text updates instantly

## Color Scheme

- **Primary Color**: #2ecc71 (Green) - Used for actions and success states
- **Secondary Color**: #3498db (Blue) - Used for information
- **Danger Color**: #e74c3c (Red) - Used for destructive actions
- **Warning Color**: #f39c12 (Orange) - Used for warnings
- **Background**: #f5f5f5 (Light gray)

## Key Features Explained

### Auto-Launch Timer

The 24-hour timer is a countdown mechanism that displays how long until the drone automatically launches to scan your fields. You can customize the hours and minutes in drone settings.

### Field Coverage

Each drone flight covers up to 5 km². If your total field area exceeds 5 km², multiple flights may be needed to scan all fields during a scheduled scan.

### Data Persistence

All user data (fields, settings, preferences) is stored in browser's localStorage and persists between sessions.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Linting

```bash
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility Features

- Semantic HTML structure
- ARIA labels for navigation
- Keyboard navigation support
- Color contrast compliant
- Focus indicators on interactive elements

## Performance Optimizations

- CSS-in-JS with optimized selectors
- Lazy loading of routes
- Efficient re-renders with Context API
- Minified production builds
- Image optimization ready

## Future Enhancements

- Real drone API integration
- GPS mapping for fields
- Weather data integration
- Detailed scan reports and analytics
- Push notifications for scan completion
- Historical scan data visualization
- Multi-language support (Punjabi, Marathi, etc.)
- Payment integration for premium features

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.

---

**Made with ❤️ for Indian Farmers**
