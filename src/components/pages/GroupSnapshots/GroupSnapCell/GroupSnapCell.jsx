import React from 'react';
import "../../SnapshotPages.css";
import {IoPeople} from "react-icons/io5";

export default function GroupSnapCell(props) {
    const {snapInfo} = props;
    const {email, members} = snapInfo;

    return (
        <div className="snapshot-cell">
            <div className="snapshot-cell-icon-container">
                <IoPeople className="snapshot-cell-icon" size={25} />
            </div>
            <div className="snapshot-info">
                <div>Email: {email}</div>
                <div className="snapshot-info-subtext">{"Taken on " + new Date(snapInfo.date).toLocaleString()}</div>
            </div>
        </div>
    );
}