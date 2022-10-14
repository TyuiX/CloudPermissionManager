import React, {useContext} from 'react';
import {Link, useLocation} from "react-router-dom";
import "./PageSideBar.css";
import SideBarDriveLink from "./SideBarDriveLink/SideBarDriveLink";
import {FaCamera, FaCameraRetro, FaFolder } from "react-icons/fa";
import {RiGroupFill} from "react-icons/ri";
import LinkGoogleLink from "./LinkGoogleLink/LinkGoogleLink";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import {UserContext} from "../../../utils/context/UserContext";

const links = [
    {path: "/files", name: "My Files"},
    {path: "/sharedfiles", name: "Shared with me"},
    {path: "/filesnapshot", name: "File Snapshots"},
    {path: "/groupsnapshot", name: "Group Snapshots"},
]

export default function PageSideBar() {
    const location = useLocation();
    const {email} = useContext(GoogleContext);
    const {user} = useContext(UserContext);

    const pathIcon = (path) => {
        switch (path) {
            case "/files":
                return <FaFolder size={20} />
            case "/sharedfiles":
                return <RiGroupFill size={20} />
            case "/filesnapshot":
                return <FaCamera size={20} />
            case "/groupsnapshot":
                return <FaCameraRetro size={20} />
            default:
                return null;
        }
    }

    return (
        <div className="sidebar-container">
            <div className="sidebar-nav">
                {links.map(({path, name}) => (
                    <Link className={"sidebar-link"}
                          key={path}
                          to={path}
                    >
                        <div className="sidebar-link-label">
                            {pathIcon(path)}
                            <span>{name}</span>
                        </div>
                        {location.pathname === path &&
                            <span>{'\u27A4'}</span>
                        }
                    </Link>
                ))}
            </div>
            <div className="linked-drives-list">
                {
                    email && email === user.googleId ?
                        <SideBarDriveLink driveType="google" linked={true} email={user.googleId} /> :
                    <LinkGoogleLink />
                }
                <SideBarDriveLink driveType="one" linked={false} />
            </div>
        </div>
    );
}