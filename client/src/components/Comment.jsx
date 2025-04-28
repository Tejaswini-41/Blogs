function Comment({ comment }) {
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
          {new Date(comment.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
      <div className="comment-body">
        <p>{comment.text}</p>
      </div>
    </div>
  );
}

export default Comment;