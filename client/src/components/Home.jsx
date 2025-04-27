import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css"

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/posts')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched posts:', data); // Log the fetched data
        setPosts(data);
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div>
      <h1>All Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/post/${post._id}`}>
              <h2>{post.title}</h2>
            </Link>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;