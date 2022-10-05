import React, {useContext} from 'react';
import "./PageHeader.css"
import {AiFillSetting, AiOutlineCloudSync} from "react-icons/ai";
import {Link} from "react-router-dom";
import SearchBar from "./SearchBar/SearchBar";
import {UserContext} from "../../../utils/context/UserContext";
import ProfileDropdownMenu from "./ProfileDropdownMenu/ProfileDropdownMenu";

export default function PageHeader() {
    const {loggedIn} = useContext(UserContext)

    if (!loggedIn) {
        return (
            <div className="page-header">
                <Link className="header-section" to="/">
                    <AiOutlineCloudSync size={30} />
                    <span>Cloud Sharing Manager</span>
                </Link>
                <div className="header-section">
                    <Link className="login-signup-link" to={"/login"}>
                        Login
                    </Link>
                    <Link className="login-signup-link" to={"/signup"}>
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
                <SearchBar />
            </div>
            <div className="header-section">
                <AiFillSetting size={30} />
                <ProfileDropdownMenu />
            </div>
        </div>
    );
}