import React from 'react';
import {AiOutlineClose} from "react-icons/ai";
import {IoWarning} from "react-icons/io5";
export default function ConfirmActionModal(props) {
    const {msg, performOperation, toggleModal} = props;

    const confirmAction = () => {
        performOperation()
        toggleModal()
    }

    return (
        <div className="modal-background">
            <div className="modal-container error-modal">
                <div className="modal-header">
                    <span>Are you sure?</span>
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
                <div className="modal-section error-msg">
                    <IoWarning className="error-icon" size={60}/>
                    <span className="error-msg-text">{msg}</span>
                </div>
                <div className="modal-footer">
                    <button className="modal-button modal-confirm" onClick={confirmAction}>Confirm</button>
                    <button className="modal-button modal-cancel" onClick={toggleModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
}