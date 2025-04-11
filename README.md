# BlogHub

BlogHub is a dynamic blog website built using HTML, CSS, and JavaScript with Firebase as the backend. It provides real-time post updates, user authentication, and interactive features like creating, liking, bookmarking, and commenting on blog posts.

## Features

- **Real-Time Updates:** Posts are rendered in real time using Firestore listeners.
- **User Authentication:** Secure sign up, login, and sign out powered by Firebase Authentication.
- **Post Management:** Create, update, and delete blog posts.
- **Interactive UI:** Like and bookmark posts, and add comments.
- **Responsive Design:** Optimized for desktops, tablets, and mobile devices.

## Dependencies

- **Firebase SDK (v9.22.0 compat):**
  - `firebase-app-compat.js`
  - `firebase-auth-compat.js`
  - `firebase-firestore-compat.js`
- **Web Technologies:**
  - HTML5, CSS3, and Vanilla JavaScript

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/BlogHub.git
   cd BlogHub

2. **Firebase Setup**

- **Create a Firebase project** at the [Firebase Console](https://console.firebase.google.com/).
- **Enable Email/Password Authentication** and set up a **Firestore Database**.
- **Update `firebase-config.js`** with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
```
3. **Running the Application:**
    - Open index.html directly in your browser.
    - Alternatively, start a local development server:
      ```bash
      
      python -m http.server 8000
      ```

4. **Optional Deployment:**
    - Use Firebase Hosting or GitHub Pages to deploy your BlogHub app.
   


## Project Structure

```bash
BlogHub/
├── firebase-config.js // Firebase configuration and initialization
├── index.html         // Main blog page with post listings and interactive UI
├── login.html         // Login page for user authentication
├── login.js           // JavaScript for handling login functionality
├── script.js          // JavaScript for blog posts, comments, and UI interactions
├── signup.html        // Sign Up page for registering new users
├── signup.js          // JavaScript for handling user registration and validations
├── style.css          // Global CSS styling and responsive design
└── README.md          // Project documentation (this file)
```


This project is licensed under the MIT License.
