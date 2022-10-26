import React, {useContext, useState} from 'react';
import {AiOutlineClose} from "react-icons/ai";
import ExistingControlReqModalPage from "./ExistingControlReqModalPage/ExistingControlReqModalPage";
import AddControlReqModalPage from "./AddControlReqModalPage/AddControlReqModalPage";
import "./AccessControlReqModal.css";
import {UserContext} from "../../../utils/context/UserContext";

export default function AccessControlReqModal(props) {
    const {toggleModal} = props;
    const [contentToShow, setContentToShow] = useState("existing")
    const {setIsLoading} = useContext(UserContext)

    const handleToggleAddModalPage = () => {
        setContentToShow("new")
    }

    const handleToggleExistingModalPage = () => {
        setContentToShow("existing")
    }

    const handlePostUpdateControlReq = async () => {
        setContentToShow("existing")
        setIsLoading(false)
    }

    return (
        <div className="modal-background">
            <div className="modal-container access-req-modal-container">
                <div className="modal-header">
                    <span>Access Control Requirements</span>
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
                <div className="modal-split-container">
                    <div className="modal-sidebar">
                        <button
                            className={"modal-sidebar-link " + (contentToShow === "existing" ? "modal-link-selected" : "")}
                            onClick={handleToggleExistingModalPage}
                        >
                            Existing Control Requirements
                        </button>
                        <button
                            className={"modal-sidebar-link " + (contentToShow === "new" ? "modal-link-selected" : "")}
                            onClick={handleToggleAddModalPage}
                        >
                            Create New Control Requirement
                        </button>
                    </div>
                    <div className="modal-content">
                        {contentToShow === "existing" &&
                            <ExistingControlReqModalPage
                                postUpdate={handlePostUpdateControlReq}
                            />
                        }
                        {contentToShow === "new" &&
                            <AddControlReqModalPage
                                toggleModal={toggleModal}
                                postUpdate={handlePostUpdateControlReq}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}