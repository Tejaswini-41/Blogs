import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegComment, FaRegThumbsUp } from 'react-icons/fa';

function PostCard({ post, user }) {
  return (
    <div className="quora-post-card">
      <div className="post-metadata">
        <span className="post-author">{post.author?.displayName || 'Anonymous'}</span>
        <span>•</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
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