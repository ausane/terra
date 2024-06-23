# Simple Twitter-Like Web Application

## Description
This project is a simple text-based web application similar to Twitter. It allows users to post updates, search for content, chat in real-time, and view user profiles.

## Features
- **Home Feed** (`/home`): Displays posts from all users.
- **Search** (`/search`): Allows users to search for content.
- **Messages** (`/messages`): Real-time chat functionality.
- **Compose**: Button to create new posts.
- **User Profile** (`/:username`): Displays profile information and posts of a specific user.

## Technologies Used
- **Frontend**:
  - HTML
  - CSS
  - JavaScript

- **Backend**:
  - Node.js
  - Express
  - EJS (Embedded JavaScript templates)
  
- **Database**:
  - MongoDB
  - Mongoose

- **Authentication**:
  - Passport-local

- **Real-time Communication**:
  - WebSocket

## Project Structure
- **models**: Contains Mongoose models.
- **controllers**: Contains logic for handling requests.
- **views**: Contains EJS templates for rendering the UI.
- **routers**: Contains route definitions.
- **utils**: Contains utility functions.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/ausane/terra.git
    ```
2. Navigate to the project directory:
    ```bash
    cd terra
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables in a `.env` file:
    ```env
    PORT=8080
    COOKIE_CODE=your_cookie_code
    MONGODB_URI=your_mongodb_uri
    SESSION_SECRET=your_session_secret
    ```

5. Start the application:
    ```bash
    node app.js
    ```

## Usage
- Navigate to `http://localhost:8080/home` to view the home feed.
- Use the search functionality at `http://localhost:8080/search`.
- Chat with other users in real-time at `http://localhost:8080/messages`.
- Create a new post using the compose button.
- View user profiles at `http://localhost:8080/:username`.

## Contributing
Feel free to submit issues or pull requests. Contributions are welcome!