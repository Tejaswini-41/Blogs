import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Post from './models/Post.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // Create a test user if not exists
    const testUser = await User.findOne({ email: 't@gmail.com' }) || 
      await User.create({
        googleId: 'test-google-id',
        displayName: 'Test User',
        email: 't@gmail.com'
      });

    await Post.deleteMany(); // Clear existing posts

    const posts = [
      {
        title: 'First Blog Post',
        content: 'This is the first post.',
        author: testUser._id,
        comments: [
          { text: 'Great post!', author: testUser._id },
          { text: 'Very informative.', author: testUser._id },
        ],
      },
      {
        title: 'Second Blog Post',
        content: 'This is the second post.',
        author: testUser._id,
        comments: [{ text: 'Thanks for sharing!', author: testUser._id }],
      },
    ];

    await Post.insertMany(posts);
    console.log('Database seeded!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();