import { useState } from 'react';

function Comment({ comment, currentUser, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  
  // Check if the current user is the author of the comment
  const isAuthor = currentUser && comment.author && 
    currentUser._id === comment.author._id;
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(comment.text);
  };
  
  const handleSaveEdit = () => {
    onEdit(comment._id, editText);
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment._id);
    }
  };

  return (
    <div className="comment">
      <div className="comment-header">
        {comment.author?.profileImage && (
          <img 
            src={comment.author.profileImage} 
            alt={comment.author.displayName || 'User'} 
            className="comment-avatar"
          />
        )}
        <strong className="comment-author">{comment.author?.displayName || 'Anonymous'}</strong>
        <span className="comment-date">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <div className="comment-body">
        {isEditing ? (
          <div className="comment-edit-form">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows="3"
            ></textarea>
            <div className="comment-edit-actions">
              <button onClick={handleSaveEdit} disabled={!editText.trim()}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <p>{comment.text}</p>
        )}
      </div>
      
      {isAuthor && !isEditing && (
        <div className="comment-actions">
          <button onClick={handleEdit} className="comment-action-btn edit">Edit</button>
          <button onClick={handleDelete} className="comment-action-btn delete">Delete</button>
        </div>
      )}
    </div>
  );
}

export default Comment;