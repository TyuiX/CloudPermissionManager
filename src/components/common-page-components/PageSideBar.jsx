import React from 'react';
import {Link, useLocation} from "react-router-dom";
import "./PageSideBar.css";

const links = [
    {path: "/files", name: "All Files"},
    {path: "/myfiles", name: "My Files"},
    {path: "/sharedfiles", name: "Shared Files"},
    {path: "/filesnapshot", name: "File Snapshots"},
    {path: "/groupsnapshot", name: "Group Snapshots"},
]

export default function PageSideBar() {
    const location = useLocation();

    return (
        <div className="sidebar-nav">
            {links.map(({path, name}) => (
                <Link className={"sidebar-link" + (location.pathname === path ? " selected-link" : "")}
                      key={path}
                      to={path}
                >
                    {name + (location.pathname === path ? '\u27A4' : "")}
                </Link>
            ))}
        </div>
    );
}