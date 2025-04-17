# Social Media App - Empathy Assignment

## Overview

This project is a social media application designed for the Empathy Assignment, focusing on user interaction with posts and reels. It allows users to log in, view content, like posts, and add comments. The application features a profile display, interactive elements, and a responsive design. It integrates with the Instagram Graph API for data and Facebook API for authentication.

## ✨ Features

*   **User Authentication:** Secure login and logout functionality.
*   **Profile Display:** Displays user information such as profile picture, username, post count, followers, and following.
*   **Content Display:** Shows a feed of posts and reels with associated likes, comments, and user details.
*   **Interactive Elements:** Users can like posts and add comments, fostering engagement.
*   **Responsive Design:** Ensures optimal viewing experience across various devices and screen sizes.

## 🛠️ Technologies Used

*   **Frontend:**
    *   [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
    *   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
    *   [Lucide React](https://lucide.dev/) - Beautifully simple, pixel-perfect icons.
    *   [React Router DOM](https://reactrouter.com/en/main) - A standard library for routing in React applications.
*   **Backend:**
    *   [Node.js](https://nodejs.org/en/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.
    *   [Express](https://expressjs.com/) - A minimalist web application framework for Node.js.
    *   [Axios](https://axios-http.com/docs/intro) - Promise based HTTP client for the browser and node.js
    *   [CORS](https://expressjs.com/en/resources/middleware/cors.html) - Middleware to enable Cross-Origin Resource Sharing.
    *   [Dotenv](https://www.npmjs.com/package/dotenv) - Zero-dependency module that loads environment variables from a `.env` file.
*   **API:**
    *   [Instagram Graph API](https://developers.facebook.com/docs/instagram-api) - For fetching user profiles, media, and reels.
    *   [Facebook API](https://developers.facebook.com/) - For user authentication and OAuth flow.

## 🚀 Setup Instructions

Follow these instructions to get the project up and running on your local machine.

### ⚙️ Frontend

1.  **Clone the repository:**

    ```
    git clone https://github.com/suryapratap04/Postmatic.git
    cd frontend
    ```

2.  **Install dependencies:**

    ```
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory of the `frontend` and add the following variables:

    ```
    VITE_BACKEND_URL=http://localhost:5000
    ```

4.  **Start the application:**

    ```
    npm run dev
    ```

    The frontend will be running on `http://localhost:5173`.

### ⚙️ Backend

1.  **Navigate to the backend directory:**

    ```
    cd backend
    ```

2.  **Install dependencies:**

    ```
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory of the `backend` and add the following variables:

    ```
    PORT=5000
    FACEBOOK_APP_ID=<your_facebook_app_id>
    FACEBOOK_APP_SECRET=<your_facebook_app_secret>
    BACKEND_URL=http://localhost:5000
    FRONTEND_URL=http://localhost:5173
    ```

4.  **Start the server:**

    ```
    node index.js
    ```

    The backend will be running on `http://localhost:5000`.

## 🧭 API Endpoints

| Method | Endpoint                 | Description                                    |
| :----- | :----------------------- | :--------------------------------------------- |
| GET    | `/api/user/:userId`      | Fetches user data.                             |
| GET    | `/api/feed/:userId`      | Fetches the user's feed (posts).               |
| GET    | `/api/reels/:userId`     | Fetches the user's reels.                      |
| POST   | `/api/comment/:postId`   | Adds a comment to a post.                      |
| GET    | `/auth/callback`         | Handles the authentication callback from Facebook. |
| GET    | `/webhook`              | Handles the webhook verification.              |
| POST   | `/webhook`              | Handles the webhook events.                    |

## ⚠️ Known Issues

*   [List any known issues or limitations here]

## 🤝 Contributing

[Add contribution guidelines if applicable]

## 📜 License

[Add license information if applicable]
