import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

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
            .then(response => {if (response.ok ) {
                navigate("/login");
            }})
    }


    const onSubmit = (e) => {

        e.preventDefault();
        registerUser();
    }

    return (
        <div id="register">
            <form onSubmit={onSubmit}>
                <input placeholder="Username" type="string" value={user.username} onChange={handleUsernameChange}></input>
                <input placeholder="Email" type="email" value={user.email} onChange={handleEmailChange}></input>
                <input placeholder="Password" type="password" value={user.password} onChange={handlePasswordChange}></input>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;