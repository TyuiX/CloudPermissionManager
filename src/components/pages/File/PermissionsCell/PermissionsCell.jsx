import React from 'react';
import {HiUser} from "react-icons/hi";
import "./PermissionsCell.css";

export default function PermissionsCell(props) {
    const {permsInfo, type} = props;
    const {displayName, role} = permsInfo;

    return (
        <div className="permission-cell">
            <HiUser className="permission-icon" size={25} />
            <div className="permission-info">
                <div className="permission-name">{displayName}</div>
                <div className="permission-role">Role: {role}</div>
            </div>
        </div>
    );
}