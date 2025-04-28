import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegComment, FaRegThumbsUp } from 'react-icons/fa';

function PostCard({ post, user }) {
  // Format date in a nice readable format
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="quora-post-card">
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
          Posted on {formatDate(post.createdAt)}
        </span>
      </div>
      
      <Link to={`/post/${post._id}`} className="post-title-link">
        <h2 className="post-title">{post.title}</h2>
      </Link>
      
      <div className="post-excerpt">{post.content.substring(0, 200)}...</div>
      
      <div className="post-actions">
        <button className="post-action">
          <FaRegThumbsUp className="action-icon" />
          <span>{post.upvotes?.length || 0} Upvotes</span>
        </button>
        
        <Link 
          to={`/post/${post._id}#comments`}
          className={`post-action ${user ? 'comment-enabled' : ''}`}
        >
          <FaRegComment className="action-icon" />
          <span>{post.comments?.length || 0} Comments</span>
        </Link>
        
        <Link to={`/post/${post._id}`} className="post-action read-more">
          Read more
        </Link>
      </div>
    </div>
  );
}

export default PostCard;