import React from 'react';
import {FaFolder} from "react-icons/fa";
import "./FileCell.css";
import {useNavigate} from "react-router-dom";

export default function FileCell(props) {
    const {fileInfo, toggleInfo, toggled, type} = props;
    const {name, id} = fileInfo;
    const navigate = useNavigate();

    const handleOnClick = (event, id) => {
        event.preventDefault();
        toggleInfo(id);
    }

    const handleSelectDrive = (event, name, id) => {
        event.preventDefault();
        navigate(`/shared/drive/${id}/${name}`)
    }

    if (type === "drive") {
        return (
            <div onClick={(event) => handleSelectDrive(event, name, id)}
                 className="file-cell">
                <FaFolder size={25} />
                <div className="file-name">{name}</div>
            </div>
        );
    }

    return (
        <div onClick={(event) => handleOnClick(event, id)}
              className={"file-cell " + (toggled ? "file-selected" : "")}>
            <FaFolder size={25} />
            <div className="file-name">{name}</div>
        </div>
    );
}