import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/auth/current_user', { credentials: 'include' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data && data._id) {
          setUser(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  return (
    <nav>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/blogimage.jpeg" alt="Blog Logo" />
          </Link>
        </div>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/new-post" className="create-post-btn">
                Create Post
              </Link>
              <p>Welcome, {user.displayName}</p>
              <a href="http://localhost:5000/auth/logout">Logout</a>
            </>
          ) : (
            <a href="http://localhost:5000/auth/google">Login with Google</a>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;