import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import BlogPost from './pages/BlogPost/BlogPost.jsx'
import NewPost from './pages/NewPost/NewPost.jsx'
import Navbar from './pages/Nav/Navbar.jsx'

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<BlogPost />} />
        <Route path="/new-post" element={<NewPost />} />
      </Routes>
    </Router>
  )
}

export default App
