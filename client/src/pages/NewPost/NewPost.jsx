import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewPost.css';

function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Add state for image URL
  const [showPreview, setShowPreview] = useState(false); // Add state for image preview
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    fetch('http://localhost:5000/auth/current_user', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data && data._id) {
          setUser(data);
        } else {
          // Redirect to login if not authenticated
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        navigate('/');
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          title, 
          content,
          imageUrl: imageUrl.trim() || undefined // Send image URL if provided
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }
      
      const newPost = await response.json();
      
      // Redirect to the newly created post
      navigate(`/post/${newPost._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle image preview
  const handleImagePreview = () => {
    if (imageUrl.trim()) {
      setShowPreview(true);
    }
  };

  if (!user) {
    return <div className="loading-container">Checking authentication...</div>;
  }

  return (
    <div className="new-post-container">
      <h1>Create New Post</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="new-post-form">
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
        
        {/* Update the image URL form group */}
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
          
          {/* Image preview */}
          {showPreview && (
            <div className="image-preview">
              <img 
                src={imageUrl || 'https://cdn.logojoy.com/wp-content/uploads/2018/05/30164225/572-768x591.png'} 
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
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewPost;