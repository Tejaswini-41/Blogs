import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true
    },
    displayName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    firstName: String,
    lastName: String,
    profileImage: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;