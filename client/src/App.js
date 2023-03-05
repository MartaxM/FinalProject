import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import React, { Suspense } from 'react';
import Register from './components/Register';
import Index from './components/Index';
import Header from './components/Header';
import PostDetails from './components/PostDetails';
import CreatePost from './components/CreatePost';

function App() {
  return (
    <Suspense fallback="loading">
      <div className="App">
        <Router>
          <Header/>
          <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/post/:post_id' element={<PostDetails />} />
            <Route path='/write' element={<CreatePost />} />
          </Routes>
        </Router>
      </div>
    </Suspense>
  );
}

export default App;
