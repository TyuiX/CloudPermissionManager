import React from 'react';
import {FaFolder} from "react-icons/fa";
import {Link} from "react-router-dom";
import "./FileCell.css"

export default function FileCell(props) {
    const {fileInfo} = props;
    const {name, id} = fileInfo;

    return (
        <Link to={`/file/${id}`}
              className="file-cell">
            <FaFolder className="file-icon" size={25} />
            <div className="file-info">
                <div className="file-name">{name}</div>
            </div>
        </Link>
    );
}