import React from 'react';
import {FaFolder} from "react-icons/fa";
import "./FileCell.css";

export default function FileCell(props) {
    const {fileInfo, toggleInfo, toggled} = props;
    const {name, id} = fileInfo;

    const handleOnClick = (event, id) => {
        event.preventDefault();
        toggleInfo(id);
    }

    return (
        <div onClick={(event) => handleOnClick(event, id)}
              className={"file-cell " + (toggled ? "file-selected" : "")}>
            <FaFolder size={25} />
            <div className="file-name">{name}</div>
        </div>
    );
}