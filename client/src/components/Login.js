import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import '../App.css';
function Login() {

    let navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        password: ""
    });

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

    const onSubmit = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: user.username,
                password: user.password
            }),
            mode: "cors"
        }
        let res = await fetch('/api/user/login', requestOptions)
        if (res.ok) {
            navigate("/")
            window.location.reload(true)
        }

    }

    return (
        <Box component="form" sx={{ width: '80%', maxWidth: 'sm',m:"auto" }} onSubmit={onSubmit} >
            <TextField required
                margin="normal"
                fullWidth
                id="outlined-required"
                placeholder="Username"
                type="string"
                value={user.username}
                onChange={handleUsernameChange}
                style={{ display: "block" }}></TextField>
            <TextField required
                fullWidth
                margin="normal"
                id="outlined-required"
                placeholder="Password" type="password" value={user.password} onChange={handlePasswordChange}
                style={{ display: "block" }}></TextField>
            <Button variant="contained" type="submit"
                className="center-align">Log in</Button>
        </Box>
    );
}

export default Login;
