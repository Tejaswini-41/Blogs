import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostForm.css';

function PostForm({ 
  initialValues = { title: '', content: '', imageUrl: '' }, 
  onSubmit, 
  submitButtonText, 
  isSubmitting,
  formTitle,
  cancelPath
}) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  // Default image URL
  const defaultImageUrl = 'https://cdn.logojoy.com/wp-content/uploads/2018/05/30164225/572-768x591.png';

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    setError('');
    
    try {
      await onSubmit({ title, content, imageUrl: imageUrl.trim() || undefined });
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle image preview
  const handleImagePreview = () => {
    if (imageUrl.trim()) {
      setShowPreview(true);
    }
  };

  return (
    <div className="post-form-container">
      <h1>{formTitle}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleFormSubmit} className="post-form">
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
            onClick={() => navigate(cancelPath)}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;