import React from 'react';
import "./PermissionsCell.css";

export default function PermissionsCell(props) {
    const {permInfo} = props;
    const {displayName, role, emailAddress, type} = permInfo;

    return (
        <div className="permission-cell">
            <div className="permission-info">
                {/*check if perm is for specific user/group or anyone*/}
                {type !== "anyone" ?
                    <>
                        <div className="permission-name">{displayName}</div>
                        <div className="permission-info">Email: {emailAddress}</div>
                        <div className="permission-info">Role: {role}</div>
                    </>
                    :
                    <>
                        <div className="permission-name">Anyone with Link</div>
                        <div className="permission-info">Role: {role}</div>
                    </>
                }
            </div>
        </div>
    );
}