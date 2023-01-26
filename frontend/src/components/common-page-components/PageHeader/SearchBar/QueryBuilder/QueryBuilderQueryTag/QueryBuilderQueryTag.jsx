import React from 'react';
import {AiOutlineClose} from "react-icons/ai";
import "./QueryBuilderQueryTag.css"

export default function QueryBuilderQueryTag(props) {
    const {label, removeTag} = props;

    return (
        <div className="query-operation-tag">
            <div className="query-operation-label">{label}</div>
            <AiOutlineClose className="query-operation-remove-button" onClick={() => removeTag(label)}/>
        </div>
    );
}