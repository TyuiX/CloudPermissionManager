import React, {useState} from 'react';
import {AiOutlineClose} from "react-icons/ai";
import ErrorPopupModal from '../../modals/ErrorPopupModal/ErrorPopupModal';
import '../../modals/UpdateSingleSharingModal/UpdateSingleSharingModal.css';
import "../index.css";

export default function MetaData(props) {
    const {permissions, toggleModal, createdOn} = props;
    const [errorMsg, setErrorMsg] = useState("");
    console.log(permissions);
    return (
        <>
            <div className="modal-background">
                <div className="modal-container">
                    <div className="modal-header">
                        <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                    </div>
                    <div className="modal-section">
                        <div className="modal-section-title">Permissions:</div>
                        <div className="modal-users-list">
                            {permissions}
                        </div>
                        <div className="modal-section-title">Creation Date:</div>
                        <div className="modal-users-list">
                            {createdOn}
                        </div>
                    </div>
                </div>
            </div>
            {errorMsg &&
                <ErrorPopupModal msg={errorMsg} updateText={setErrorMsg} />
            }
        </>
    )
}