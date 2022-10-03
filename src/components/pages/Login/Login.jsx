import React, {useContext, useState} from 'react';
import {UserContext} from "../../../utils/context/UserContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loginUser } = useContext(UserContext)

    const handleSubmit = (e) => {
        e.preventDefault();
        const login = { email, password };
        loginUser(login)
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email Address: </label>
            <input
                type="text"
                value={email}
                placeholder="Enter email address..."
                onChange={({ target }) => setEmail(target.value)}
            />
            <div>
                <label htmlFor="password">Password: </label>
                <input
                    type="password"
                    value={password}
                    placeholder="Enter password..."
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};