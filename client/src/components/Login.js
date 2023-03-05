import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Alert,Typography } from "@mui/material";

/**
 * 
 * @returns Login component, a form to login
 */

function Login() {

    let navigate = useNavigate();
    //alert to show info if incorret login
    const [alert, setAlert] = useState();
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    //Functions to handle changes to the TextFields
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

    /**
     * 
     * @param {*} e event
     * 
     * Calls the login API when form is submitted
     */
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
            //If sucessful, navigate to the Write Post page
            navigate("/write")
            //Reload page so that the Header changes
            window.location.reload(true)
        } else {
            //If it fails, set alert
            setAlert(<Alert mt={2} severity="warning">Invalid Credentials</Alert>)
            /**Alert does not contain why, to make login more difficult if person is trying
            random usernames or passwords**/
        }
    }

    return (
        <>
            <Typography variant="title">Login</Typography>
            <Box component="form" sx={{ width: '80%', maxWidth: 'sm', m: "auto" }} onSubmit={onSubmit} >
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
                {alert}
            </Box>
        </>
    );
}

export default Login;
