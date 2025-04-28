import express from 'express';
import passport from 'passport';

const router = express.Router();

// Route to initiate Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route for Google to redirect to
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:5173/'); // Redirect to the frontend after successful login
  }
);

// Route to log out
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('http://localhost:5173/');
  });
});

// Route to get the current logged-in user
router.get('/current_user', (req, res) => {
  res.send(req.user || null);
});

export default router;