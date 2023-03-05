import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { TextField, Button, Box, Alert,Typography } from "@mui/material";

/**
 * @returns Register Component, which is a form to register
 */
function Register() {
    let navigate = useNavigate();
    //Alert to show if register was incorrect
    const [alert, setAlert] = useState();

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    });

    //Functions to handle changes to the TextFields
    function handleEmailChange(e) {
        setUser({
            ...user,
            email: e.target.value
        });
    }

    function handleUsernameChange(e) {
        setUser({
            ...user,
            username: e.target.value
        });
    }

    function handlePasswordChange(e) {
        setUser({
            ...user,
            password: e.target.value
        });
    }

    //Function to call the api to register
    const registerUser = async () => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: user.username,
                email: user.email,
                password: user.password
            }),
            mode: "cors"
        }
        let res = await fetch('/api/user/register', requestOptions)
        if (!res.ok) {
            let msg = await res.json();
            //If registering was not possible, show why
            setAlert(<Alert severity="warning">{msg.msg}</Alert>);
        } else {
            //else, navigate to login
            navigate("/login")
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        registerUser();
    }

    return (
    <>
        <Typography variant="title">Register</Typography>
        <Box component="form" sx={{ width: '80%', maxWidth: 'sm', m: "auto" }} onSubmit={onSubmit}>
            <TextField required
                margin="normal"
                fullWidth
                id="outlined-required"
                placeholder="Username"
                type="string" value={user.username}
                onChange={handleUsernameChange}></TextField>
            <TextField required
                margin="normal"
                fullWidth
                id="outlined-required"
                placeholder="Email"
                type="email" value={user.email}
                onChange={handleEmailChange}></TextField>
            <TextField required
                margin="normal"
                fullWidth
                id="outlined-required"
                placeholder="Password"
                type="password" value={user.password}
                onChange={handlePasswordChange}></TextField>
            {alert}
            <Button variant="contained" className="center-align" type="submit">Register</Button>
        </Box>
    </>
    );
}

export default Register;