import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const onSubmit = (e) => {
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
        fetch('/api/user/login', requestOptions)
            .then(response => {
                if (response.ok) { navigate("/"); }
            })

    }

    return (
        <div id="Login">
            <form onSubmit={onSubmit}>
                <input placeholder="Username" type="string" value={user.username} onChange={handleUsernameChange}></input>
                <input placeholder="Password" type="password" value={user.password} onChange={handlePasswordChange}></input>
                <button type="submit">Log in</button>
            </form>
        </div>
    );
}

export default Login;
