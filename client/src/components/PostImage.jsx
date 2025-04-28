import React from 'react';
import './PostImage.css';

function PostImage({ src, alt, className = "post-image", fullSize = false }) {
  // Default image URL
  const defaultImageUrl = 'https://cdn.logojoy.com/wp-content/uploads/2018/05/30164225/572-768x591.png';
  
  const containerClass = fullSize ? "post-image-full" : "post-image-container";
  
  return (
    <div className={containerClass}>
      <img 
        src={src || defaultImageUrl} 
        alt={alt || "Blog post image"} 
        className={className}
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = defaultImageUrl;
        }}
      />
    </div>
  );
}

export default PostImage;