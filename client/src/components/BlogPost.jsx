import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Comment from './Comment.jsx';
import './Home.css'; // Reusing the same styles

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/posts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
        setLoading(false);
      });
  }, [id]);

  // Helper function to format date
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

  return (
    <div className="quora-container">
      <div className="quora-layout">
        <div className="quora-main">
          {loading ? (
            <div className="quora-loading">
              <span>Loading post...</span>
              <div className="quora-loader"></div>
            </div>
          ) : (
            <div className="quora-post-detail">
              <Link to="/" className="back-link">
                <span className="action-icon">←</span> Back to posts
              </Link>
              
              <div className="post-header">
                <h1 className="post-title">{post.title}</h1>
                <div className="post-metadata">
                  <span className="post-date">{formatDate(post.createdAt)}</span>
                  {post.author && <span className="post-author">By: {post.author}</span>}
                </div>
              </div>
              
              <div className="post-content-full">
                {post.content.split('\n').map((paragraph, idx) => (
                  paragraph && <p key={idx}>{paragraph}</p>
                ))}
              </div>
              
              <div className="post-actions">
                <div className="post-action">
                  <span className="action-icon">👍</span>
                  <span>Upvote</span>
                </div>
                <div className="post-action">
                  <span className="action-icon">💬</span>
                  <span>Comment</span>
                </div>
                <div className="post-action">
                  <span className="action-icon">⤴️</span>
                  <span>Share</span>
                </div>
              </div>
              
              <div className="comments-section">
                <h3>Comments ({post.comments?.length || 0})</h3>
                {post.comments && post.comments.length > 0 ? (
                  <ul className="comment-list">
                    {post.comments.map((comment, index) => (
                      <li key={comment.id || index} className="comment-item">
                        <Comment comment={comment} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="quora-sidebar">
          <div className="sidebar-section">
            <h3>Related Topics</h3>
            <ul className="topic-list">
              <li><a href="#">Technology</a></li>
              <li><a href="#">Science</a></li>
              <li><a href="#">Health</a></li>
              <li><a href="#">Business</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;