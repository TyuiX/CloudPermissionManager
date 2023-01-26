import React, {useContext} from 'react';
import {Link, useLocation} from "react-router-dom";
import "./PageSideBar.css";
import SideBarDriveLink from "./SideBarDriveLink/SideBarDriveLink";
import {FaCamera, FaCameraRetro, FaFolder } from "react-icons/fa";
import {RiGroupFill} from "react-icons/ri";
import LinkGoogleLink from "./LinkGoogleLink/LinkGoogleLink";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import {UserContext} from "../../../utils/context/UserContext";
import LinkOneDriveLink from './LinkOneDriveLink/LinkOneDriveLink';
import { OneDriveContext } from '../../../utils/context/OneDriveContext';
import {FiHardDrive} from "react-icons/fi";

const links = [
    {path: "/files", name: "My Files"},
    {path: "/sharedfiles", name: "Shared with me"},
    {path: "/shared/drives", name: "Shared Drives"},
    {path: "/filesnapshot", name: "File Snapshots"},
    {path: "/groupsnapshot", name: "Group Snapshots"},
]

const ODlinks = [
    {path: "/ODfiles", name: "My Files"},
    {path: "/ODsharedfiles", name: "Shared with me"},
    {path: "/ODfilesnapshot", name: "File Snapshots"},
]

export default function PageSideBar() {
    const location = useLocation();
    const {email} = useContext(GoogleContext);
    const {ODemail} = useContext(OneDriveContext);
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
            case "/shared/drives":
                return <FiHardDrive size={20} />
            case "/ODfiles":
                return  <FaFolder size={20} />
            case "/ODsharedfiles":
                    return <RiGroupFill size={20} />
            case "/ODfilesnapshot":
                    return <FaCamera size={20} />
            default:
                return null;
        }
    }

    return (
        <div className="sidebar-container">
            <div className="linked-drives-list">
                {
                    email && email === user.googleId ?
                        <SideBarDriveLink driveType="google" linked={true} email={user.googleId} /> :
                    <LinkGoogleLink />
                }
            </div>
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
                {    ODemail && ODemail === user.oneDriveId?
                        <SideBarDriveLink driveType="one" linked={true} email={user.oneDriveId}/>:
                    <LinkOneDriveLink />
                }
            </div>
            <div className="sidebar-nav">
                {ODlinks.map(({path, name}) => (
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
        </div>
    );
}