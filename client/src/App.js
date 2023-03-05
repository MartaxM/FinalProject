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

/**
 * Set theme, that way everything share colors and other things
 */
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

/**
 * Typography custom variants
 */
theme.typography.title = {
  fontSize: '3.7rem',
  color: purple[700],
  fontWeight: "bold",
  /**
   * Title is very big, so I set some changes if the screen is smaller
   * */
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

// Set responsive FontSizes to the theme
theme = responsiveFontSizes(theme);

/**
 * 
 * @returns the app
 * ThemeProvider sets the theme for everything inside
 * Header appears in all pages
 * The deffined routes are:
 * 
 *  / -> Index where the posts appear
 *  /login -> to log in
 *  /register -> To register
 *  /post/:post_id -> lets user see the details of a post and its comments
 *  /write -> to write a post
 */
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
