import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";
import Sidebar from '../../components/Sidebar.jsx';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/posts')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched posts:', data);
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  // Helper function to generate a readable date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString || Date.now());
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Unknown date';
    }
  };

  // Helper to calculate estimated reading time
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/)?.length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

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
              <span>Loading posts...</span>
              <div className="quora-loader"></div>
            </div>
          ) : (
            <div className="quora-feed">
              {posts.map((post) => (
                <div key={post.id || post._id} className="quora-post-card">
                  <div className="post-metadata">
                    <span className="post-date">{formatDate(post.createdAt)}</span>
                    <span className="post-read-time">{getReadingTime(post.content)} min read</span>
                  </div>
                  
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-excerpt">{post.content.substring(0, 200)}...</p>
                  
                  <div className="post-actions">
                    <div className="post-action">
                      <span className="action-icon">👍</span>
                      <span>Upvote</span>
                    </div>
                    <div className="post-action">
                      <span className="action-icon">💬</span>
                      <span>Comment</span>
                    </div>
                    <Link to={`/post/${post._id}`} className="post-action read-more">
                      <span className="action-icon">📖</span>
                      <span>Read More</span>
                    </Link>
                  </div>
                </div>
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