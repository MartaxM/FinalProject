import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import React, { Suspense } from 'react';
import Register from './components/Register';
import Index from './components/Index';

function App() {
  return (
    <Suspense fallback="loading">
      <div className="App">
        <Router>
          <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </Router>
      </div>
    </Suspense>
  );
}

export default App;
