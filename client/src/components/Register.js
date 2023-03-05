import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { TextField, Button, Box } from "@mui/material";

function Register() {

    let navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    });

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

    const registerUser = () => {

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
        fetch('/api/user/register', requestOptions)
            .then(response => {
                if (response.ok) {
                    navigate("/login");
                }
            })
    }


    const onSubmit = (e) => {

        e.preventDefault();
        registerUser();
    }

    return (
        <Box component="form" sx={{ width: '80%', maxWidth: 'sm',m:"auto" }} onSubmit={onSubmit}>
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
            <Button variant="contained" className="center-align" type="submit">Register</Button>
        </Box>
    );
}

export default Register;