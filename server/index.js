import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import session from 'express-session';
import passport from 'passport';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';
import './config/passport.js';

dotenv.config();

connectDB(); // db connect

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from the frontend
  credentials: true, // Allow cookies to be sent
})
);
app.use(express.json());

// // Root route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });


// Configure session
app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET    ,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Blog post routes
app.use('/posts', postRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});