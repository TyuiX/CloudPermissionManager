import React, {useContext, useState} from 'react';
import {UserContext} from "../../../utils/context/UserContext";
import {Link} from "react-router-dom";
import {AiOutlineCloudSync} from "react-icons/ai";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("")
    const { createUser } = useContext(UserContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { username, email, password };
        let msg = await createUser(user)
        console.log(msg)
        if (msg) {
            setErrorMsg(msg)
        }
    };

    return (
        <>
            <div className="form-container">
                <Link className="app-logo" to="/">
                    <AiOutlineCloudSync size={30} />
                    <span>Cloud Sharing Manager</span>
                </Link>
                <form onSubmit={handleSubmit} className="account-form">
                    <div className="form-title">SIGN UP</div>
                    <label htmlFor="email">Username</label>
                    <input
                        className="form-input"
                        type="text"
                        value={username}
                        placeholder="Enter username..."
                        onChange={({ target }) => setUsername(target.value)}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        className="form-input"
                        type="text"
                        value={email}
                        placeholder="Enter email address..."
                        onChange={({ target }) => setEmail(target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        className="form-input"
                        value={password}
                        type="password"
                        placeholder="Enter password..."
                        onChange={({ target }) => setPassword(target.value)}
                    />
                    <div className="form-error-msg">
                        {errorMsg}
                    </div>
                    <button className="form-button" type="submit">SIGN UP</button>
                </form>
            </div>
        </>
    );
}