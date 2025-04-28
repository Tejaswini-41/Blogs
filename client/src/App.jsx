import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import BlogPost from './components/BlogPost.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<BlogPost />} />
      </Routes>
    </Router>
  )
}

export default App
