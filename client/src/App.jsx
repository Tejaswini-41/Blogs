import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import BlogPost from './pages/BlogPost/BlogPost.jsx'
import NewPost from './pages/BlogPost/NewPost.jsx'
import EditPost from './pages/BlogPost/EditPost.jsx'
import DeletePost from './pages/BlogPost/DeletePost.jsx'
import Navbar from './pages/Nav/Navbar.jsx'

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<BlogPost />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/delete-post/:id" element={<DeletePost />} />
      </Routes>
    </Router>
  )
}

export default App
