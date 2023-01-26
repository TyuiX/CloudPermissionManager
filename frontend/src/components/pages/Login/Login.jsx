import React, {useContext, useState} from 'react';
import {UserContext} from "../../../utils/context/UserContext";
import "../index.css";
import {AiOutlineCloudSync} from "react-icons/ai";
import {Link} from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("")
    const { loginUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        const login = {email, password};
        let msg = await loginUser(login)
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
                    <div className="form-title">LOGIN</div>
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
                    <button className="form-button" type="submit">LOGIN</button>
                </form>
            </div>
        </>
    );
};