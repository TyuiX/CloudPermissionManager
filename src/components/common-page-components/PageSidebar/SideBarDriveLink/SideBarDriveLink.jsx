import React, {useEffect, useState} from 'react';
import {FaGoogleDrive} from "react-icons/fa";
import {ImOnedrive} from "react-icons/im";
import "./SideBarDriveLink.css";
import drives from "../../../../utils/CloudDrives";

export default function SideBarDriveLink(props) {
    const {driveType, linked, email} = props;
    const [drive, setDrive] = useState({});

    useEffect(() => {
        if (!driveType) {
            return
        }
        setDrive(drives[driveType])
    }, [driveType])

    const driveIcon = () => {
        if (!drive) {
            return null;
        }
        switch (drive.id) {
            case "google":
                return <FaGoogleDrive size={20} />
            case "one":
                return <ImOnedrive size={20} />
            default:
                return null;
        }
    }

    if (!linked) {
        return (
            <div className="drive-account drive-login-link">
                {driveIcon()}
                <span>Link {drive.name} account</span>
            </div>
        )
    }

    return (
        <div className="drive-account">
            {driveIcon()}
            <span>{email}</span>
        </div>
    );
}