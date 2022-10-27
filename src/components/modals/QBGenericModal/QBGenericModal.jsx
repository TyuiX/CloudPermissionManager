import React, {useState} from 'react';
import {AiOutlineClose} from "react-icons/ai";

export default function QBGenericModal(props){
    const {toggleModal, qMap, setQMap, currentValue} = props;
    const [selectedOption, setSelectedOption] = useState();

    const confirmUpdate = (e) => {
        e.preventDefault();
        console.log(selectedOption);
        console.log(currentValue);
        setQMap(qMap.set(currentValue, selectedOption));
        toggleModal()
    }

    return (
        <div className="modal-background">
            <div className="modal-container error-modal">
                <div className="modal-header">
                    {/* <span>{fileName}</span> */}
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
            <div className="modal-section">
                <div className="modal-section-title">{currentValue}</div>
                <input
                    type="text"
                    onChange={({ target }) => setSelectedOption(target.value)}
                />
            </div>
            <div className="modal-footer">
                <button className="modal-button modal-confirm" onClick={(e) => confirmUpdate(e)}>Confirm</button>
                <button className="modal-button modal-cancel" onClick={toggleModal}>Cancel</button>
            </div>
        </div>
    </div>
    );
}