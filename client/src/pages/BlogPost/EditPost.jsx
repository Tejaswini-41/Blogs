import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../../components/PostForm';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({ title: '', content: '', imageUrl: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
                throw new Error('You can only edit your own posts');
              }
              
              setInitialValues({
                title: postData.title,
                content: postData.content,
                imageUrl: postData.imageUrl || ''
              });
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

  const handleUpdatePost = async (formData) => {
    setIsSubmitting(true);
    
    const response = await fetch(`http://localhost:5000/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update post');
    }
    
    const updatedPost = await response.json();
    navigate(`/post/${updatedPost._id}`);
  };

  if (isLoading) {
    return <div className="loading-container">Loading post...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate(`/post/${id}`)}>Back to Post</button>
      </div>
    );
  }

  return (
    <PostForm
      initialValues={initialValues}
      onSubmit={handleUpdatePost}
      submitButtonText={isSubmitting ? 'Saving...' : 'Save Changes'}
      isSubmitting={isSubmitting}
      formTitle="Edit Post"
      cancelPath={`/post/${id}`}
    />
  );
}

export default EditPost;