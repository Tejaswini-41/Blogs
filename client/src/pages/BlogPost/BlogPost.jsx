import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import Comment from '../../components/Comment.jsx';
import './BlogPost.css';
import Sidebar from '../../components/Sidebar.jsx';
import PostImage from '../../components/PostImage';

function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const commentsRef = useRef(null);
  const location = useLocation();
  
  // Fetch current user
  useEffect(() => {
    fetch('http://localhost:5000/auth/current_user', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        setUser(data);
      })
      .catch(error => console.error('Error fetching user:', error));
  }, []);

  // Fetch post
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/posts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched post:', data); // Log the post data
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    // Scroll to comments section if URL has #comments hash
    if (location.hash === '#comments' && commentsRef.current) {
      setTimeout(() => {
        commentsRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 500); // Small delay to ensure content is loaded
    }
  }, [location.hash, post]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    setCommenting(true);
    
    try {
      const response = await fetch(`http://localhost:5000/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text: commentText })
      });
      
      if (!response.ok) throw new Error('Failed to add comment');
      
      const updatedPost = await response.json();
      setPost(updatedPost);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommenting(false);
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${id}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text: newText })
      });
      
      if (!response.ok) throw new Error('Failed to edit comment');
      
      const updatedPost = await response.json();
      setPost(updatedPost);
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${id}/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to delete comment');
      
      const updatedPost = await response.json();
      setPost(updatedPost);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

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

  // Helper function to check if user is the author
  const isPostAuthor = () => {
    return user && post && user._id === post.author._id;
  };

  // Handle post deletion
  // const handleDeletePost = async () => {
  //   if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
  //     return;
  //   }
    
  //   setIsDeleting(true);
    
  //   try {
  //     const response = await fetch(`http://localhost:5000/posts/${id}`, {
  //       method: 'DELETE',
  //       credentials: 'include',
  //     });
      
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Failed to delete post');
  //     }
      
  //     // Redirect to home page after successful deletion
  //     navigate('/');
  //   } catch (error) {
  //     console.error('Error deleting post:', error);
  //     alert('Failed to delete post: ' + error.message);
  //     setIsDeleting(false);
  //   }
  // };

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
                  {post.author && <span className="post-author">By: {post.author.displayName || 'Anonymous'}</span>}
                </div>
                
                {isPostAuthor() && (
                  <div className="post-author-actions">
                    <Link to={`/edit-post/${id}`} className="edit-post-btn">
                      Edit Post
                    </Link>
                    <Link to={`/delete-post/${id}`} className="delete-post-btn">
                      Delete Post
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="post-content-full">
                {post.content.split('\n').map((paragraph, idx) => (
                  paragraph && <p key={idx}>{paragraph}</p>
                ))}
                {post.imageUrl && <PostImage src={post.imageUrl} alt={post.title} fullSize={true} />}
              </div>
              
              <div className="post-actions">
                <button className="post-action">
                  <span className="action-icon">👍</span>
                  <span>Upvote</span>
                </button>
                
                <button 
                  className="post-action"
                  onClick={() => {
                    if (commentsRef.current) {
                      commentsRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <span className="action-icon">💬</span>
                  <span>Comments ({post.comments?.length || 0})</span>
                </button>
                
                <button className="post-action">
                  <span className="action-icon">⤴️</span>
                  <span>Share</span>
                </button>
              </div>
              
              <div className="comments-section" ref={commentsRef} id="comments">
                <h3>Comments ({post.comments?.length || 0})</h3>
                
                {user ? (
                  <form onSubmit={handleCommentSubmit} className="comment-form">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      rows="3"
                      required
                    ></textarea>
                    <button 
                      type="submit" 
                      disabled={commenting || !commentText.trim()}
                      className="comment-submit"
                    >
                      {commenting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </form>
                ) : (
                  <div className="login-prompt">
                    <p>
                      <a href="http://localhost:5000/auth/google">Login with Google</a> to leave a comment.
                    </p>
                  </div>
                )}
                
                {/* Comments List - Now sorted with newest first */}
                {post.comments && post.comments.length > 0 ? (
                  <ul className="comment-list">
                    {[...post.comments]
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((comment, index) => (
                        <li key={comment._id || index} className="comment-item">
                          <Comment 
                            comment={comment} 
                            currentUser={user}
                            onEdit={handleEditComment}
                            onDelete={handleDeleteComment}
                          />
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
        
        <Sidebar title="Related Topics" />
      </div>
    </div>
  );
}

export default BlogPost;