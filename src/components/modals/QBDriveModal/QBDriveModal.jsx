import React, {useState} from 'react';
import {AiOutlineClose} from "react-icons/ai";

export default function QBDriveModal(props){
    const {toggleModal, qMap, setQMap} = props;
    const [selectedOption, setSelectedOption] = useState();

    const confirmUpdate = (e) => {
        e.preventDefault();
        setQMap(qMap.set("drive:drive", selectedOption));
        console.log(qMap);
        toggleModal();
    }

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    }

    return (
        <div className="modal-background">
            <div className="modal-container error-modal">
                <div className="modal-header">
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
            <div className="modal-section">
                <div className="modal-section-title">Drive:</div>
                <div >
                    <label>
                        <input type="radio" value="My Drive"
                               checked={selectedOption === "My Drive"}
                               onChange={handleOptionChange} />
                        My Drive
                    </label>
                    <label>
                        <input type="radio" value="Share Drive"
                               checked={selectedOption === "Share Drive"}
                               onChange={handleOptionChange} />
                        Share Drive
                    </label>
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