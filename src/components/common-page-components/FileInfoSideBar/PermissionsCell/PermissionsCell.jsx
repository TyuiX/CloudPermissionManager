import React from 'react';
import "./PermissionsCell.css";

export default function PermissionsCell(props) {
    const {permInfo} = props;
    const {displayName, role, emailAddress} = permInfo;

    return (
        <div className="permission-cell">
            <div className="permission-info">
                <div className="permission-name">{displayName}</div>
                <div className="permission-info">Email: {emailAddress}</div>
                <div className="permission-info">Role: {role}</div>
            </div>
        </div>
    );
}