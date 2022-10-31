import React from 'react';
import "./SnapCell.css";
import {FaFolder} from "react-icons/fa";

export default function FileCell(props) {
    const {snapInfo} = props;
    let date = snapInfo.date + "";

    let month = date.substring(5, 7);
    let day = date.substring(8, 10);
    let time = date.substring(11, date.length - 5);


    let monthString = "";
    if(month === "10") { monthString = "October"}
    else if(month === "11") { monthString = "November"}
    else if(month === "12") { monthString = "December"}
    let fullDate = "Taken on " + monthString + " " + day + ", " + 2022 + " at " + time;

    return (
        <div className="snapshot-cell">
            <div className="snapshot-cell-icon-container">
                <FaFolder className="snapshot-cell-icon" size={25} />
            </div>
            <div className="snapshot-info">
                <div>Id: {snapInfo._id}</div>
                <div className="snapshot-info-subtext">{fullDate}</div>
            </div>
        </div>
    );
}