import React, {useContext} from 'react';
import {AiOutlineClose} from "react-icons/ai";
import {UserContext} from "../../../utils/context/UserContext";

export default function AccessControlReqModal(props) {
    const {toggleModal} = props;
    const {user} = useContext(UserContext)

    return (
        <div className="modal-background">
            <div className="modal-container">
                <div className="modal-header">
                    <span>Access Control Requirements</span>
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
                <div className="modal-section">
                    <div className="modal-section-title">Sharing Differences:</div>
                </div>
            </div>
        </div>
    );
}