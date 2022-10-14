import React, {useContext, useEffect, useState} from 'react';
import "./RecentSearchModal.css";
import {AiOutlineClose} from "react-icons/ai";
import { getSnapshots, getUserProfile } from '../../../api/ShareManagerAPI';

export default function RecentSearchModal(props) {
    const {toggleModal, fileName} = props;
    const [recentSearches, setRecentSearches] = useState(["mus119_paper", "cleanenergycover", "vocab.txt"]);
    // const [snapshots, setSnap] = useState([]);
    const [selectedOption, setSelectedOption] = useState();

    const confirmUpdate = (e) => {
        e.preventDefault();
        console.log("confirm");
        // console.log(selectedOption);
        props.setFileName(selectedOption);
        toggleModal();
    }

    const handleOptionChange = (e) => {
        console.log(e.target.value);
        setSelectedOption(e.target.value);
    }

    return (
        <div className="modal-background">
            <div className="modal-container">
                <div className="modal-header">
                    <span>{fileName}</span>
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
                <div className="modal-section">
                    <div className="modal-section-title">Recent Searches:</div>
                    <div className="modal-users-list">
                        {recentSearches.length !== 0 ?
                            recentSearches.map((search) => {
                                return (
                                    <div className="radio">
                                        <label>
                                            <input type="radio" value={search} 
                                                        checked={selectedOption === search} 
                                                        onChange={handleOptionChange} />
                                            {search}
                                        </label>
                                    </div>
                                )
                            })
                            :
                            <div className="no-users-message">No recent searches...</div>
                        }
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