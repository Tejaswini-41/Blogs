import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in database
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
          // User exists, return the user
          return done(null, user);
        } else {
          // Created new user based on Google profile
          const newUser = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            email: profile.emails[0].value,
            profileImage: profile.photos?.[0]?.value
          });
          
          return done(null, newUser);
        }
      } catch (error) {
        console.error('Error saving user:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize user - store only the user id in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user - retrieve user from database using id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});