# Blogs - A Full-Stack Blogging Platform

<p align="center">
  <img src="https://st.depositphotos.com/2745455/4383/v/450/depositphotos_43831043-stock-illustration-blogging-concept-illustration.jpg" alt="Blogs Platform Logo" width="600">
</p>

A modern blogging platform built with the MERN stack (MongoDB, Express, React, Node.js) featuring Google OAuth authentication and robust post management functionality.

## Features

- 🔐 **User Authentication** via Google OAuth 2.0
- 📝 **Post Management**:
  - Create, read, update, and delete blog posts
  - Rich text content and image support
  - Upvote functionality
- 💬 **Comment System**:
  - Add, edit, and delete comments on posts
  - Comment threads with author information
- 📱 **Responsive Design**:
  - Mobile-friendly interface
  - Clean, modern UI

## Technology Stack

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React.js">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
</p>

### Frontend
- React.js with functional components and hooks
- React Router for navigation
- CSS for styling

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Passport.js for authentication
- RESTful API architecture

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB instance
- Google OAuth credentials

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Tejaswini-41/Blogs.git
   cd Blogs
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   PORT=5000
   ```

4. Start the development server
   ```bash
   npm run dev
   ```
   This will start both the backend server and the frontend client concurrently.

## Usage

- Visit `http://localhost:5173` in your browser
- Log in with your Google account
- Create, read, update, or delete blog posts
- Comment on posts and engage with other users

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/current_user` - Get current user
- `GET /auth/logout` - Log out

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get a specific post
- `POST /posts` - Create a new post
- `PUT /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post
- `POST /posts/:id/upvote` - Toggle upvote on a post

### Comments
- `POST /posts/:id/comments` - Add a comment to a post
- `PUT /posts/:postId/comments/:commentId` - Edit a comment
- `DELETE /posts/:postId/comments/:commentId` - Delete a comment

## Project Structure

```
Blogs/
├── client/               # React frontend
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # Reusable components
│       ├── pages/        # Page components
│       └── App.jsx       # Main app component
│
├── server/               # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
│
└── package.json          # Project metadata and scripts
```

## Contributors

- Tejaswini Durge

## Connect

<p align="center">
  <a href="https://github.com/Tejaswini-41"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="https://www.linkedin.com/in/tejaswinidurge/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
</p>

## License

This project is licensed under the ISC License.