import React from 'react';
import "../../SnapshotPages.css";
import {FaFolder} from "react-icons/fa";

export default function SnapCell(props) {
    const {snapInfo} = props;

    return (
        <div className="snapshot-cell">
            <div className="snapshot-cell-icon-container">
                <FaFolder className="snapshot-cell-icon" size={25} />
            </div>
            <div className="snapshot-info">
                <div>Id: {snapInfo._id}</div>
                <div className="snapshot-info-subtext">{"Taken on " + new Date(snapInfo.date).toLocaleString()}</div>
            </div>
        </div>
    );
}