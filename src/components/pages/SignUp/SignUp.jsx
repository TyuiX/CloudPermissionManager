import React, {useContext, useState} from 'react';
import {UserContext} from "../../../utils/context/UserContext";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { createUser } = useContext(UserContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { username, email, password };
        createUser(user)
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username: </label>
            <input
                type="text"
                value={username}
                placeholder="Enter username..."
                onChange={({ target }) => setUsername(target.value)}
            />
            <div>
                <label htmlFor="email">Email: </label>
                <input
                    type="text"
                    value={email}
                    placeholder="Enter email address..."
                    onChange={({ target }) => setEmail(target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Password: </label>
                <input
                    type="password"
                    value={password}
                    placeholder="Enter password..."
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">Sign Up</button>
        </form>
    );
}