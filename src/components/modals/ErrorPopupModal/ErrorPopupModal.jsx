import React from 'react';
import {AiOutlineClose} from "react-icons/ai";
import {MdCancel} from "react-icons/md";
import "./ErrorPopupModal.css";

export default function ErrorPopupModal(props) {
    const {msg, updateText} = props;

    return (
        <div className="modal-background">
            <div className="modal-container error-modal">
                <div className="modal-header">
                    <span>Error!</span>
                    <AiOutlineClose className="sidebar-close-button" onClick={() => updateText("")} />
                </div>
                <div className="modal-section error-msg">
                    <MdCancel className="error-icon" size={60}/>
                    <span className="error-msg-text">{msg}</span>
                </div>
                <button className="modal-button modal-confirm error-confirm" onClick={() => updateText("")}>OK</button>
            </div>
        </div>
    );
}