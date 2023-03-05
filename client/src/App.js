import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import React, { Suspense } from 'react';
import Register from './components/Register';
import Index from './components/Index';
import Header from './components/Header';
import PostDetails from './components/PostDetails';
import CreatePost from './components/CreatePost';

import { purple, blue, grey } from '@mui/material/colors';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: blue[500],
    },
  },
});
theme.typography.title = {
  fontSize: '3.7rem',
  color: purple[700],
  fontWeight: "bold",
  [theme.breakpoints.down('md')]: {
    fontSize: '3.3rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.4rem',
  },
};

theme.typography.by_user_tag = {
    fontSize: '1.2rem',
    color: purple[700],
};

theme.typography.greytext = {
  color: grey[600],
};


theme = responsiveFontSizes(theme);

function App() {
  return (
    <Suspense fallback="loading">
      <ThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <Header />
            <Routes>
              <Route path='/' element={<Index />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/post/:post_id' element={<PostDetails />} />
              <Route path='/write' element={<CreatePost />} />
            </Routes>
          </Router>
        </div>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
