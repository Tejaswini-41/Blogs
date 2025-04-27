import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Post from './models/Post.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await Post.deleteMany(); // Clear existing data

    const posts = [
      {
        title: 'First Blog Post',
        content: 'This is the first post.',
        comments: [
          { text: 'Great post!', author: 'tejuu' },
          { text: 'Very informative.', author: 'arya' },
        ],
      },
      {
        title: 'Second Blog Post',
        content: 'This is the second post.',
        comments: [{ text: 'Thanks for sharing!', author: 'Charlie' }],
      },
    ];

    await Post.insertMany(posts); // Insert new data
    console.log('Database seeded!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();