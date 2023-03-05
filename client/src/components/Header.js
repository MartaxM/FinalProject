import React from 'react';
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import { Box, Toolbar } from '@mui/material';
import { useNavigate } from "react-router-dom";

const Header = () => {
    let navigate = useNavigate();

    const logOut = (e) => {
        e.preventDefault();
        fetch("/api/user/logout", { method: 'POST' })
            .then(response => {
                if (response.ok) {navigate("/");}
            })
    }
    
    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position='static'>
                    <Toolbar>
                        <Button href="/" color='inherit'>
                            Home
                        </Button>
                        <Button href="/login" color='inherit'>
                            Login
                        </Button>
                        <Button href="/register" color='inherit'>
                            Register
                        </Button>
                        <Button href="/write" color='inherit'>
                            Write Post
                        </Button>
                        <Button color='inherit' onClick={logOut}>
                            LogOut
                        </Button>
                        
                    </Toolbar>
                </AppBar>
            </Box>

        </div>
    )
}

export default Header