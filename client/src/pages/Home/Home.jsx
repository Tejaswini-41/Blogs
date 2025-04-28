import { useState, useEffect } from 'react';
import PostCard from '../../components/PostCard';
import "./Home.css";
import Sidebar from '../../components/Sidebar';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user and posts
  useEffect(() => {
    // Fetch current user
    fetch('http://localhost:5000/auth/current_user', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data && data._id) {
          setUser(data);
        }
      })
      .catch(error => console.error('Error fetching user:', error));
      
    // Fetch posts
    fetch('http://localhost:5000/posts')
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="quora-container">
      <div className="quora-header">
        <h1>Blogs - Explore, Learn and Share</h1>
        <p className="subtitle">Discover insights from experts and enthusiasts</p>
      </div>
      
      <div className="quora-layout">
        <div className="quora-main">
          {loading ? (
            <div className="quora-loading">
              <div className="quora-loader"></div>
              <p>Loading posts...</p>
            </div>
          ) : (
            <div className="quora-feed">
              {posts.map(post => (
                <PostCard key={post._id} post={post} user={user} />
              ))}
            </div>
          )}
        </div>
        
        <Sidebar title="Related blog topics"/>
      </div>
    </div>
  );
}

export default Home;