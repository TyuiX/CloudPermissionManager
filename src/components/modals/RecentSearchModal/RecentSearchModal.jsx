import React, {useState, useContext} from 'react';
import "./RecentSearchModal.css";
import {AiOutlineClose, AiOutlineExclamationCircle} from "react-icons/ai";
import {UserContext} from "../../../utils/context/UserContext";

export default function RecentSearchModal(props) {
    const {toggleModal, setSearchText} = props;
    const {recentSearches} = useContext(UserContext);
    const [selectedOption, setSelectedOption] = useState();
    console.log(recentSearches);

    // applies selected recent search to search bar
    const confirmUpdate = (e) => {
        e.preventDefault();
        console.log("confirm");
        setSearchText(selectedOption);
        toggleModal();
    }

    // handle which search is selected
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    }

    return (
        <div className="modal-background">
            <div className="recent-modal-container">
                <div className="modal-header">
                    <span></span>
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
                <div className="modal-section">
                    <div className="modal-section-title">Recent Searches:</div>
                    <div className="modal-users-list">
                        {recentSearches !== undefined && recentSearches.length !== 0?
                            recentSearches.map((search) => {
                                return (
                                    <div className="recent-search-option">
                                        <label className="recent-search-option-label">
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
                <div className="modal-footnote">
                    <AiOutlineExclamationCircle size={25} />
                    <div>
                        Select a recent search query/text that you wish to perform again. The selected query will
                        be applied to the search bar. Note: You will have to choose to search as a text or query option
                        yourself once applied.
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="modal-button modal-confirm" onClick={(e) => confirmUpdate(e)}>Apply</button>
                    <button className="modal-button modal-cancel" onClick={toggleModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
}