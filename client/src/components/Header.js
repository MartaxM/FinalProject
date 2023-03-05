import React from 'react';
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import { Box, Toolbar } from '@mui/material';
import { useEffect, useState } from "react";

const Header = () => {
    const [logged, setLogged] = useState(false);

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
                setLogged(res.ok)
            }
        }

        fetchLoggingState();
        return () => { mounted = false; };
    }, [])

    const logOut = async (e) => {
        e.preventDefault();
        let res = await fetch("/api/user/logout", { method: 'POST' })

        if (res.ok) { window.location.reload(true) }
    }

    if (logged) {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position='static'>
                    <Toolbar>
                        <Button href="/" color='inherit'>
                            Home
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