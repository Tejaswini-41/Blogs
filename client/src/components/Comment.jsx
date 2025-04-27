function Comment({ comment }) {
  return (
    <li>
      <p><strong>{comment.author}:</strong> {comment.text}</p>
    </li>
  );
}

export default Comment;