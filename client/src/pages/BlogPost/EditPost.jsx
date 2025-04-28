import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPost.css';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Default image URL
  const defaultImageUrl = 'https://cdn.logojoy.com/wp-content/uploads/2018/05/30164225/572-768x591.png';

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
                throw new Error('You can only edit your own posts');
              }
              
              setTitle(postData.title);
              setContent(postData.content);
              setImageUrl(postData.imageUrl || '');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:5000/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          title, 
          content,
          imageUrl: imageUrl.trim() || undefined 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post');
      }
      
      const updatedPost = await response.json();
      navigate(`/post/${updatedPost._id}`);
    } catch (error) {
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  // Handle image preview
  const handleImagePreview = () => {
    if (imageUrl.trim()) {
      setShowPreview(true);
    }
  };

  if (isLoading) {
    return <div className="loading-container">Loading post...</div>;
  }

  return (
    <div className="edit-post-container">
      <h1>Edit Post</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="edit-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="imageUrl">
            Image URL (optional - default image will be used if left empty)
          </label>
          <div className="image-url-input">
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {imageUrl ? (
              <button 
                type="button" 
                className="preview-btn"
                onClick={handleImagePreview}
              >
                Preview
              </button>
            ) : (
              <span className="default-image-note">Using default image</span>
            )}
          </div>
          
          {showPreview && (
            <div className="image-preview">
              <img 
                src={imageUrl || defaultImageUrl} 
                alt="Preview" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x400/e0e0e0/0a5c5c?text=Invalid+Image+URL';
                }}
              />
              <button 
                type="button" 
                className="close-preview" 
                onClick={() => setShowPreview(false)}
              >
                ×
              </button>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            rows="10"
            required
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate(`/post/${id}`)}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;