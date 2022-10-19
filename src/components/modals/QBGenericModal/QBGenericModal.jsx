import React, {useState} from 'react';
import "./QBGenericModal.css";
import {AiOutlineClose} from "react-icons/ai";

export default function QBGenericModal(props){
    const {toggleModal, qMap, setQMap, currentValue} = props;
    const [selectedOption, setSelectedOption] = useState();

    const confirmUpdate = (e) => {
        e.preventDefault();
        setQMap(qMap.set(currentValue, selectedOption));
        console.log(qMap);
        toggleModal();
    }

    return (
        <div className="modal-background">
            <div className="recent-modal-container">
                <div className="modal-header">
                    {/* <span>{fileName}</span> */}
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
            <div className="modal-section">
                <div className="modal-section-title">{currentValue}</div>
                <div className="modal-users-list">
                    <input
                        type="text"
                        onChange={({ target }) => setSelectedOption(target.value)}
                    />
                </div>
            </div>
            <div className="modal-footer">
                <button className="modal-button modal-confirm" onClick={(e) => confirmUpdate(e)}>Confirm</button>
                <button className="modal-button modal-cancel" onClick={toggleModal}>Cancel</button>
            </div>
        </div>
    </div>
    );
}