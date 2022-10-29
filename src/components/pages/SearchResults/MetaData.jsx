import React, {useState} from 'react';
import {AiOutlineClose} from "react-icons/ai";
import ErrorPopupModal from '../../modals/ErrorPopupModal/ErrorPopupModal';
import '../../modals/UpdateSingleSharingModal/UpdateSingleSharingModal.css';
import "../index.css";

export default function MetaData(props) {
    const {permissions, toggleModal} = props;
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
                            {/* {permissions.length !== 0 ?
                                permissions.map((perm) => {
                                    return (
                                        <div className="modal-user-item" key={perm}>
                                            {perm}
                                        </div>
                                    )
                                })
                                :
                                <div className="no-users-message">No new users...</div>
                            } */}
                            {permissions}
                        </div>
                    </div>
                </div>
            </div>
            {errorMsg &&
                <ErrorPopupModal msg={errorMsg} updateText={setErrorMsg} />
            }
            
            {/* <div className="update-access-button-container">
                Permissons: {permissions}
            </div> */}
                
        </>
    )
}