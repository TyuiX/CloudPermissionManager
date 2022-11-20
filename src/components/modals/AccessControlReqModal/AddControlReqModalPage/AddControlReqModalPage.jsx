import React, {useContext, useState} from 'react';
import AddControlReqTypeSection from "./AddControlReqTypeSection/AddControlReqTypeSection";
import "./AddControlReqModalPage.css";
import {UserContext} from "../../../../utils/context/UserContext";
import ErrorPopupModal from "../../ErrorPopupModal/ErrorPopupModal";

export default function AddControlReqModalPage(props) {
    const {toggleModal, postUpdate} = props;
    const {createNewControlReq, setIsLoading} = useContext(UserContext)
    const [searchQuery, setSearchQuery] = useState("");
    const [allowedWriters, setAllowedWriters] = useState({emails: [], domains: [], size: 0});
    const [allowedReaders, setAllowedReaders] = useState({emails: [], domains: [], size: 0});
    const [deniedWriters, setDeniedWriters] = useState({emails: [], domains: [], size: 0});
    const [deniedReaders, setDeniedReaders] = useState({emails: [], domains: [], size: 0});
    const [checkGroups, setCheckGroups] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const confirmUpdate = (e) => {
        e.preventDefault();
        if (searchQuery.trim().length === 0) {
            setErrorMsg("Cannot create without an Access Control Requirement without a search query!")
        }
        else {
            let sizeSum = allowedWriters.size + allowedReaders.size + deniedWriters.size + deniedReaders.size;
            if (sizeSum <= 0) {
                setErrorMsg("At least one of Allowed Writers, Allowed Readers, Denied Writers, or Denied Readers must not be empty!")
            }
            else {
                setIsLoading(true)
                let fullQuery = searchQuery;
                let accForGrp = checkGroups;
                // additional checks if user explicitly added "groups:off" to search query (takes precedence over checkbox)
                if (fullQuery.startsWith("groups:off and ")) {
                    accForGrp = false;
                } else {
                    // check if user wanted to account for grp mems or not if "groups:off" wasn't explicitly in text
                    if (!checkGroups) {
                        fullQuery = "groups:off and " + fullQuery;
                    }
                }
                let newReq = {
                    query: fullQuery,
                    aw: allowedWriters,
                    ar: allowedReaders,
                    dw: deniedWriters,
                    dr: deniedReaders,
                    group: accForGrp
                }
                createNewControlReq(newReq);
                postUpdate()
            }
        }
    }

    const handleChecked = (e) => {
        if (e.target.checked) {
            setCheckGroups(true);
        } else {
            setCheckGroups(false);
        }
    }

    return (
        <>
            <div className="modal-section">
                <div className="modal-section-title">Search Query</div>
                <form onSubmit={(e) => e.preventDefault()} className="modal-form">
                    <input
                        className="modal-form-input"
                        type="text"
                        value={searchQuery}
                        placeholder="Query: e.g. owner:example@email.com"
                        onChange={({ target }) => setSearchQuery(target.value)}
                    />
                </form>
            </div>
            <AddControlReqTypeSection title={"Allowed Writers"} updateList={setAllowedWriters} />
            <AddControlReqTypeSection title={"Allowed Readers"} updateList={setAllowedReaders} />
            <AddControlReqTypeSection title={"Denied Writers"} updateList={setDeniedWriters} />
            <AddControlReqTypeSection title={"Denied Readers"} updateList={setDeniedReaders} />
            <div className="add-req-footer">
                <div className="add-req-footer-section">
                    <input defaultChecked={checkGroups} type="checkbox" id="checkGroup" name="checkGroup" onChange={(e) => handleChecked(e)}/>
                    <label className="check-group-mem-checkbox-label" htmlFor="checkGroup">Account for Group
                        Membership</label>
                </div>
                <div className="add-req-footer-section">
                    <button className="modal-button modal-confirm" onClick={(e) => confirmUpdate(e)}>Confirm</button>
                    <button className="modal-button modal-cancel" onClick={toggleModal}>Cancel</button>
                </div>
            </div>
            {errorMsg &&
                <ErrorPopupModal msg={errorMsg} updateText={setErrorMsg} />
            }
        </>
    );
}