import React, {useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import "./PageSideBar.css";
import SideBarDriveLink from "./SideBarDriveLink/SideBarDriveLink";
import {FaCamera, FaCameraRetro, FaFolder, FaRegFolder} from "react-icons/fa";
import {RiGroupFill} from "react-icons/ri";

const links = [
    {path: "/files", name: "All Files"},
    {path: "/myfiles", name: "My Files"},
    {path: "/sharedfiles", name: "Shared Files"},
    {path: "/filesnapshot", name: "File Snapshots"},
    {path: "/groupsnapshot", name: "Group Snapshots"},
]

export default function PageSideBar() {
    const [linkedGoogle, setLinkedGoogle] = useState(false);
    const [linkedOne, setLinkedOne] = useState(false);
    const location = useLocation();

    const pathIcon = (path) => {
        switch (path) {
            case "/files":
                return <FaFolder size={20} />
            case "/myfiles":
                return <FaRegFolder size={20} />
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
                <SideBarDriveLink driveType="google" linked={false} />
                <SideBarDriveLink driveType="one" linked={false} />
            </div>
        </div>
    );
}