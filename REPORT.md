# CampusPulse — College Event Management Website

**Developed by:** SK Anisur Rahaman  
**Technologies:** HTML5, CSS3, JavaScript

## Features
- Responsive landing page, event cards, category filters, event countdown and animated statistics.
- Event registration with validation and browser-local storage.
- Student registration lookup and local administration directory with search, filter, CSV export and delete controls.
- Login and create-account UI with validation, duplicate-email checks, show/hide password, local demo session, personalized greeting and logout.
- Gallery, feedback form, light/dark theme, mobile navigation and scroll animations.

## Run
Keep `index.html`, `style.css`, `portal.css`, `script.js`, and `favicon.svg` in the same folder, then open `index.html` in a modern browser.

## Security and deployment notes
This remains a front-end academic demo. Accounts and event registrations are stored in local browser storage and do not sync to other devices. Demo passwords are not protected; do not use real/reused passwords or sensitive information. The login does not secure the administration area. Production requires server-side authentication, strong password hashing, HTTPS, session handling, server-side validation, and authorization.
