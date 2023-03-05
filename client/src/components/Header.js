import React from 'react';
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import { Box, Toolbar } from '@mui/material';
import { useEffect, useState } from "react";
/**
 * 
 * @returns Header Component
 * 
 * It appears in all pages
 * 
 * If logged in, it will show the Posts, Write Post and Logout options
 * If not, it will show the Posts, Login and Register options
 */
const Header = () => {
    const [logged, setLogged] = useState(false);

    /**
     * UseEffect to check if logged_in
     *  */ 
    useEffect(() => {
        let mounted = true;
        const requestOptions = {
            method: 'GET',
            mode: "cors"
        }
        async function fetchLoggingState() {
            let res = await fetch("/api/user/logged_in", requestOptions)
                .catch((e) => {
                    console.log(e);
                })
            if (mounted) {
                console.log(res.ok)
                // Set logged state to the state of the response
                setLogged(res.ok)
            }
        }

        fetchLoggingState();
        return () => { mounted = false; };
    }, [])

    /**
     * 
     * @param {*} e event
     * 
     * Logout function, activated when logout pressed
     */
    const logOut = async (e) => {
        e.preventDefault();
        let res = await fetch("/api/user/logout", { method: 'POST' })

        if (res.ok) { window.location.reload(true) }
    }

    /**
     * This is the if that decides what will show, logged is set with the useEffect Hook
     */
    if (logged) {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position='static'>
                    <Toolbar>
                        <Button href="/" color='inherit'>
                            Posts
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
        )
    } else {
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
                        </Toolbar>
                    </AppBar>
                </Box>

            </div>
        )
    }

}

export default Header