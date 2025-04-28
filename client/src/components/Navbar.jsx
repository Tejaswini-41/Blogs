import { useEffect, useState } from 'react';
import { data } from 'react-router-dom';

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/auth/current_user', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        console.log("user", data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  return (
    <nav>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <a href="http://localhost:5000/auth/logout">Logout</a>
        </div>
      ) : (
        <a href="http://localhost:5000/auth/google">Login with Google</a>
      )}
    </nav>
  );
}

export default Navbar;