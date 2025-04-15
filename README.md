# Empathy Assignment 

## Overview

This project is a social media application designed for the Empathy Assignment. It allows users to view posts and reels, like content, and add comments. The application includes a login system, profile display, and mock data to simulate real user interactions.

## Features

-   **User Authentication:** Allows users to log in and log out of the application.
-   **Profile Display:** Shows the user's profile information, including profile picture, username, number of posts, followers, and following.
-   **Content Display:** Displays posts and reels with likes, comments, and user details.
-   **Interactive Elements:** Enables users to like posts and add comments.
-   **Mock Data:** Utilizes mock data to simulate user profiles, posts, and reels.
-   **Responsive Design:** The application is designed to be responsive and work on various screen sizes.

## Technologies Used

-   **Frontend:**
    -   React
    -   Tailwind CSS
    -   Lucide React (icons)
    -   React Router DOM
-   **Backend:**
    -   Node.js
    -   Express
    -   Axios
    -   CORS
    -   Dotenv
-   **API**:
    - Instagram Graph API
    - Facebook API

## Setup Instructions

### Frontend

1.  **Clone the repository:**
2.  **Install dependencies:**
3.  
3.  **Set up environment variables:**

    Create a `.env` file in the root directory of the `frontend` and add the following variables:

4.  **Start the application:**


The frontend will be running on `http://localhost:5173`.

### Backend

1.  **Navigate to the backend directory:**


2.  **Install dependencies:**


3.  **Set up environment variables:**

    Create a `.env` file in the root directory of the `backend` and add the following variables:

PORT=5000
FACEBOOK_APP_ID=<your_facebook_app_id>
FACEBOOK_APP_SECRET=<your_facebook_app_secret>
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173


4.  **Start the server:**


The backend will be running on `http://localhost:5000`.


## API Endpoints

-   `GET /api/user/:userId`: Fetches user data.
-   `GET /api/feed/:userId`: Fetches the user's feed (posts).
-   `GET /api/reels/:userId`: Fetches the user's reels.
-   `POST /api/comment/:postId`: Adds a comment to a post.
-   `GET /auth/callback`: Handles the authentication callback from Facebook.
-   `GET /webhook`: Handles the webhook verification.
-   `POST /webhook`: Handles the webhook events.

## Known Issues

-   [List any known issues or limitations here]

## Contributing

[Add contribution guidelines if applicable]

## License

[Add license information if applicable]





