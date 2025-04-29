import React from 'react';
import { Link } from 'react-router-dom';

function PostCard({ post, user }) {
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
        <button className="post-action" onClick={(e) => e.stopPropagation()}>
          <span className="action-icon">👍</span>
          <span>{post.upvotes?.length || 0}</span>
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