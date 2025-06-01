# Tsafira Travel Planner

A modern web application for planning personalized travel experiences in Morocco. This application allows users to explore destinations, create custom itineraries, and book authentic experiences with local guides.

---

## Project Structure

```
city_pass/
│
├── public/
│   ├── index.html                # Main landing page
│   ├── README.md                 # Project documentation
│   ├── assets/                   # Static assets (images, data)
│   │   ├── data/                 # JSON data files (guides, userData, etc.)
│   │   └── image/                # Additional images
│   ├── css/                      # Tailwind and custom CSS files
│   ├── images/                   # Card and logo images
│   ├── js/                       # JavaScript modules
│   │   ├── core/                 # Core modules (auth, loader, etc.)
│   │   ├── pages/                # Page-specific JS (city-pass, purchase, etc.)
│   │   ├── utils/                # Utility functions
│   │   ├── ui.js                 # UI logic (theme, mobile menu, scroll progress)
│   │   └── main.js               # Main entry point
│   ├── pages/                    # Main HTML pages (city, routes, test, etc.)
│   └── partials/                 # Reusable HTML fragments (header, footer)
│
├── .vscode/                      # VS Code settings
├── .idea/                        # IDE project files
├── .gitignore
├── .firebaserc
├── firebase.json
└── .firebase/                    # Firebase cache and config
```

---

## Core Modules

### UI Module (`ui.js`)
- Handles theme management (dark/light mode)
- Manages the mobile menu (open/close, accessibility)
- Initializes scroll progress bar

### Auth Module (`core/auth.js`)
- Manages user authentication state
- Updates navigation UI based on auth state

### Loader Module (`core/loader.js`)
- Dynamically loads HTML partials (header, footer)

### Utility Module (`utils/utils.js`)
- Provides helper functions for DOM and other utilities

### Page Modules (`pages/`)
- Contains logic for specific pages (e.g., city-pass, purchase)

---

## Theme Management

- Uses a `dark` class on the `<html>` element
- Persists user preference in `localStorage`
- Tailwind CSS dark mode classes are used throughout

---

## Mobile Menu

- Accessible and keyboard-navigable
- Smooth open/close animations
- Consistent across all pages

---

## Scroll Progress

- A scroll progress bar is initialized via the UI module
- Responsive and animated as the user scrolls

---

## Data

- Static JSON files in `public/assets/data/` (e.g., `guides.json`, `userData.json`)
- Used for guides, user stats, and other dynamic content

---

## Maintenance Guidelines

- Add new features to the appropriate module
- Extend the UI module for new UI components
- Use Tailwind CSS for styling and respect dark mode
- Follow the modular JavaScript pattern
- Use utility functions from `utils.js` where possible

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Performance Optimization

- Modular JS for optimal loading
- Critical CSS is inlined
- Images are optimized

---

## Getting Started

1. Clone the repository
2. Serve the `public/` directory with a static server (e.g., `firebase serve`, `live-server`, or VS Code Live Server)
3. Open `index.html` in your browser

---

## License

This project is for educational and demonstration purposes.
