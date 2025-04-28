import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../../components/PostForm';

function NewPost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleCreatePost = async (formData) => {
    setIsSubmitting(true);
    
    const response = await fetch('http://localhost:5000/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create post');
    }
    
    const newPost = await response.json();
    navigate(`/post/${newPost._id}`);
  };

  if (!user) {
    return <div className="loading-container">Checking authentication...</div>;
  }

  return (
    <PostForm
      initialValues={{ title: '', content: '', imageUrl: '' }}
      onSubmit={handleCreatePost}
      submitButtonText={isSubmitting ? 'Creating...' : 'Create Post'}
      isSubmitting={isSubmitting}
      formTitle="Create New Post"
      cancelPath="/"
    />
  );
}

export default NewPost;