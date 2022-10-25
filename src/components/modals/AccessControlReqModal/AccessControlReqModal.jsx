import React, {useState} from 'react';
import {AiOutlineClose} from "react-icons/ai";
import AddControlReqModal from "../AddControlReqModal/AddControlReqModal";

export default function AccessControlReqModal(props) {
    const {toggleModal} = props;
    const [showAddModal, setShowAddModal] = useState(false);
    const [newReqs, setNewReqs] = useState([]);

    const handleAddNewReq = (newReq) => {
        let addedReqs = JSON.parse(JSON.stringify(newReqs));
        addedReqs.push(newReq)
        setNewReqs(addedReqs)
    }

    const handleToggleAddModal = () => {
        setShowAddModal(!showAddModal)
    }

    return (
        <>
            <div className="modal-background">
                <div className="modal-container">
                    <div className="modal-header">
                        <span>Access Control Requirements</span>
                        <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                    </div>
                    <button onClick={handleToggleAddModal}>Create new </button>
                    <div className="modal-section">
                        <div className="modal-section-title">Existing Requirements</div>
                    </div>
                </div>
            </div>
            {showAddModal &&
                <AddControlReqModal
                    toggleModal={handleToggleAddModal}
                />
            }
        </>
    );
}