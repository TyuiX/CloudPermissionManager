import React, {useState} from 'react';
import {AiOutlineClose} from "react-icons/ai";
import AddControlReqModalPage from "./AddControlReqModalPage/AddControlReqModalPage";
import "./AccessControlReqModal.css";

export default function AccessControlReqModal(props) {
    const {toggleModal} = props;
    const [contentToShow, setContentToShow] = useState("existing")
    const [newReqs, setNewReqs] = useState([]);

    const handleAddNewReq = (newReq) => {
        let addedReqs = JSON.parse(JSON.stringify(newReqs));
        addedReqs.push(newReq)
        setNewReqs(addedReqs)
    }

    const handleToggleAddModalPage = () => {
        setContentToShow("new")
    }

    const handleToggleExistingModalPage = () => {
        setContentToShow("existing")
    }

    return (
        <>
            <div className="modal-background">
                <div className="modal-container access-req-modal-container">
                    <div className="modal-header">
                        <span>Access Control Requirements</span>
                        <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                    </div>
                    <div className="modal-split-container">
                        <div className="modal-sidebar">
                            <button className="modal-sidebar-link" onClick={handleToggleExistingModalPage}>Existing Control Requirements</button>
                            <button className="modal-sidebar-link" onClick={handleToggleAddModalPage}>Create New Control Requirement</button>
                        </div>
                        <div className="modal-content">
                            {contentToShow === "existing" &&
                                <div>Existing</div>
                            }
                            {contentToShow === "new" &&
                                <AddControlReqModalPage
                                    toggleModal={toggleModal}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}