import React, {useState} from 'react';
import {AiOutlineClose} from "react-icons/ai";
import AddControlReqTypeSection from "./AddControlReqTypeSection/AddControlReqTypeSection";
import "./AddControlReqModal.css";

export default function AddControlReqModal(props) {
    const {toggleModal} = props;
    const [searchQuery, setSearchQuery] = useState("");
    const [allowedWriters, setAllowedWriters] = useState([]);
    const [allowedReaders, setAllowedReaders] = useState([]);
    const [deniedWriters, setDeniedWriters] = useState([]);
    const [deniedReaders, setDeniedReaders] = useState([]);

    const confirmUpdate = (e) => {
        e.preventDefault();
        // updateFilePerms(fileId, updatedUsers, newUsers, false);
        // toggleModal();
    }

    return (
        <>
            <div className="modal-background">
                <div className="modal-container">
                    <div className="modal-header">
                        <span>New Access Control Requirement</span>
                        <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                    </div>
                    <div className="modal-section">
                        <div className="modal-section-title">Search Query</div>
                        <form className="modal-form">
                            <input
                                className="modal-form-input"
                                type="text"
                                value={searchQuery}
                                placeholder="Query: e.g. owner:example@email.com"
                                onChange={({ target }) => setSearchQuery(target.value)}
                            />
                        </form>
                    </div>
                    <AddControlReqTypeSection title={"Allowed Writers"} />
                    <AddControlReqTypeSection title={"Allowed Readers"} />
                    <AddControlReqTypeSection title={"Denied Writers"} />
                    <AddControlReqTypeSection title={"Denied Readers"} />
                    <div className="add-req-footer">
                        <div className="add-req-footer-section">
                            <input type="checkbox" id="checkGroup" name="checkGroup"/>
                            <label className="check-group-mem-checkbox-label" htmlFor="checkGroup">Account for Group
                                Membership</label>
                        </div>
                        <div className="add-req-footer-section">
                            <button className="modal-button modal-confirm" onClick={(e) => confirmUpdate(e)}>Confirm</button>
                            <button className="modal-button modal-cancel" onClick={toggleModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}