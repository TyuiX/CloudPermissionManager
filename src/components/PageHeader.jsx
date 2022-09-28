import React from 'react';
import "./PageHeader.css"
import {FaUserCircle} from "react-icons/fa";
import {AiFillSetting, AiOutlineCloudSync} from "react-icons/ai";

export default function PageHeader() {

    return (
        <div className="page-header">
            <div className="header-section">
                <AiOutlineCloudSync size={30} />
                <span>Cloud Sharing Manager</span>
            </div>
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