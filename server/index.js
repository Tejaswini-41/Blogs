import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

connectDB(); // db connect

const app = express();
app.use(cors());
app.use(express.json());

// // Root route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// Blog post routes
app.use('/posts', postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});