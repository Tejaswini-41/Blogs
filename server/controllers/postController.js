const posts = [
  { id: 1, title: 'First Blog Post', content: 'This is the first post.' },
  { id: 2, title: 'Second Blog Post', content: 'This is the second post.' },
];

// Get all posts
export const getPosts = (req, res) => {
  res.json(posts);
};

// Get a single post by ID
export const getPostById = (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
};