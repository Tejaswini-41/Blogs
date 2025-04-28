import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DeletePost.css';

function DeletePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Check if user is authenticated and fetch post data
  useEffect(() => {
    // Get current user
    fetch('http://localhost:5000/auth/current_user', { credentials: 'include' })
      .then(response => response.json())
      .then(userData => {
        if (userData && userData._id) {
          setUser(userData);
          
          // Fetch the post data
          fetch(`http://localhost:5000/posts/${id}`, { credentials: 'include' })
            .then(response => {
              if (!response.ok) throw new Error('Post not found or you do not have permission');
              return response.json();
            })
            .then(postData => {
              // Check if user is the author
              if (postData.author._id !== userData._id) {
                throw new Error('You can only delete your own posts');
              }
              
              setPost(postData);
              setIsLoading(false);
            })
            .catch(error => {
              setError(error.message);
              setIsLoading(false);
            });
        } else {
          // Redirect to home if not authenticated
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        navigate('/');
      });
  }, [id, navigate]);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:5000/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }
      
      // Redirect to home page after successful deletion
      navigate('/', { replace: true });
    } catch (error) {
      setError(error.message);
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/post/${id}`);
  };

  if (isLoading) {
    return <div className="loading-container">Loading post...</div>;
  }

  return (
    <div className="delete-post-container">
      <h1>Delete Post</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="delete-post-content">
        <p className="warning-text">Are you sure you want to delete this post?</p>
        <p className="warning-subtext">This action cannot be undone.</p>
        
        <div className="post-preview">
          <h2>{post.title}</h2>
          <p>{post.content.substring(0, 150)}...</p>
        </div>
        
        <div className="delete-actions">
          <button 
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            className="delete-button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePost;