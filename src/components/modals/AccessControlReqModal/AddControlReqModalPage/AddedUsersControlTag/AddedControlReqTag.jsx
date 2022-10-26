import React from 'react';
import {AiOutlineClose} from "react-icons/ai";
import "./AddedControlReqTag.css";

export default function AddedControlReqTag(props) {
    const {label, removeTag} = props;

    return (
        <div className="added-item-tag">
            <div className="added-item-label">{label}</div>
            <AiOutlineClose className="added-item-remove-button" onClick={() => removeTag(label)}/>
        </div>
    );
}