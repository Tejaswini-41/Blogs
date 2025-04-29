import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function PostCard({ post, user }) {
  // Track if a post has been upvoted by the current user
  const [upvoted, setUpvoted] = useState(post.upvotes?.includes(user?._id));
  const [upvoteCount, setUpvoteCount] = useState(post.upvotes?.length || 0);
  const [isUpvoting, setIsUpvoting] = useState(false);

  // Format date in a compact format
  const formatDate = (dateString) => {
    try {
      const options = { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return "Unknown date";
    }
  };

  // Truncate the excerpt text to fewer characters
  const truncateContent = (content) => {
    if (!content) return '';
    if (content.length <= 120) return content;
    return content.substring(0, 120) + '...';
  };

  // Default image URL to use when no image is provided
  const defaultImageUrl = 'https://cdn.logojoy.com/wp-content/uploads/2018/05/30164225/572-768x591.png';

  // Handle upvote click
  const handleUpvote = async (e) => {
    e.stopPropagation();
    
    // If user is not logged in, don't allow upvoting
    if (!user) {
      alert('Please log in to upvote posts');
      return;
    }
    
    if (isUpvoting) return; // Prevent multiple clicks
    
    setIsUpvoting(true);
    
    try {
      const response = await fetch(`http://localhost:5000/posts/${post._id}/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to upvote post');
      }
      
      const data = await response.json();
      
      // Update local state
      setUpvoted(data.userUpvoted);
      setUpvoteCount(data.upvoteCount);
    } catch (error) {
      console.error('Error upvoting post:', error);
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <div className="quora-post-card">
      <Link to={`/post/${post._id}`} className="post-card-link">
        <div className="post-metadata">
          {post.author?.profileImage && (
            <img 
              src={post.author.profileImage} 
              alt={post.author.displayName || 'User'} 
              className="post-author-avatar"
            />
          )}
          <span className="post-author">{post.author?.displayName || 'Anonymous'}</span>
          <span className="post-date">
            {formatDate(post.createdAt)}
          </span>
        </div>
        
        <h2 className="post-title">{post.title}</h2>
        
        {/* Always show an image container - either with the post's image or the default */}
        <div className="post-image-container">
          <img 
            src={post.imageUrl || defaultImageUrl} 
            alt={post.title} 
            className="post-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImageUrl;
            }} 
          />
        </div>
        
        <div className="post-excerpt">{truncateContent(post.content)}</div>
      </Link>
      
      <div className="post-actions">
        <button 
          className={`post-action ${upvoted ? 'upvoted' : ''}`} 
          onClick={handleUpvote}
          disabled={isUpvoting}
        >
          <span className="action-icon">{upvoted ? '❤️' : '👍'}</span>
          <span>{upvoteCount}</span>
        </button>
        
        <Link 
          to={`/post/${post._id}#comments`}
          className={`post-action ${user ? 'comment-enabled' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="action-icon">💬</span>
          <span>{post.commentCount || post.comments?.length || 0}</span>
        </Link>
        
        <Link to={`/post/${post._id}`} className="post-action read-more">
          Read more
        </Link>
      </div>
    </div>
  );
}

export default PostCard;