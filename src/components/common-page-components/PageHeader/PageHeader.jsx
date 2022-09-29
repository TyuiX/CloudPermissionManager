import React from 'react';
import "./PageHeader.css"
import {FaUserCircle} from "react-icons/fa";
import {AiFillSetting, AiOutlineCloudSync} from "react-icons/ai";
import {Link} from "react-router-dom";

export default function PageHeader(props) {
    const {loggedIn} = props;

    if (!loggedIn) {
        return (
            <div className="page-header">
                <Link className="header-section" to="/">
                    <AiOutlineCloudSync size={30} />
                    <span>Cloud Sharing Manager</span>
                </Link>
                <div className="header-section">
                    <Link className="login-signup-link" to={loggedIn ? "/files" : "/login"}>
                        Login
                    </Link>
                    <Link className="login-signup-link" to={loggedIn ? "/files" : "/signup"}>
                        Sign Up
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="page-header">
            <Link className="header-section" to="/files">
                <AiOutlineCloudSync size={30} />
                <span>Cloud Sharing Manager</span>
            </Link>
            <div className="header-section">
                Search Bar PlaceHolder
            </div>
            <div className="header-section">
                <AiFillSetting size={30} />
                <FaUserCircle size={30} />
            </div>
        </div>
    );
}