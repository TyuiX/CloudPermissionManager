import React, {useContext, useState} from 'react';
import {UserContext} from "../../../../utils/context/UserContext";
import "./CheckControlReqModalPage.css";
import {AiOutlineCheckCircle} from "react-icons/ai";
import ControlReqViolationBlock from "./ControlReqViolationBlock/ControlReqViolationBlock";

export default function CheckControlReqModalPage() {
    const {controlReqs, snapshots, getControlReqQueryFiles, checkViolations} = useContext(UserContext);
    const [selectedSnap, setSelectedSnap] = useState(snapshots.length !== 0 ? snapshots[0] : {});
    const [violations, setViolations] = useState([]);
    const [searchedViolations, setSearchedViolations] = useState(false)

    const handleSnapshotClick = (e) => {
        e.preventDefault()
        let found = snapshots.find(({_id}) => _id ===  e.target.value)
        if (found) {
            setSelectedSnap(found);
        }
    }

    const handleCheckReq = async (e) => {
        e.preventDefault();
        let reqViolations = [];
        for (const req of controlReqs) {
            const index = controlReqs.indexOf(req);
            let currentViolations = {
                index: index + 1,
                violations: [],
            }
            let searchResults = await getControlReqQueryFiles(req, selectedSnap)
            // console.log(searchResults)
            searchResults.forEach(({name, permissions}) => {
                if (!permissions) {
                    return;
                }
                permissions.filter(({type}) => type === "user").forEach(({emailAddress, role}) => {
                    checkViolations(emailAddress, role, name, req, currentViolations)
                })
            })
            if (currentViolations.violations.length > 0) {
                reqViolations.push(currentViolations)
            }
        }
        setViolations(reqViolations);
        setSearchedViolations(true);
    }

    return (
        <>
            <div className="modal-section">
                <div className="modal-section-title">Check Access Control Requirements</div>
                {controlReqs.length !== 0 ?
                    <>
                        {snapshots.length > 0 ?
                            <>
                                <div className="check-req-header">
                                    <div className="check-req-snapshot-container">
                                        <div>Snapshot:</div>
                                        <select onChange={(e) => handleSnapshotClick(e)}>
                                            {
                                                snapshots.map(({_id}) => (
                                                    <option key={_id} value={_id}>{_id}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <button className="check-req-button" onClick={(e) => handleCheckReq(e)}>
                                        Check Snapshot
                                    </button>
                                </div>
                                {searchedViolations &&
                                    <>
                                        {violations.length > 0 ?
                                            violations.map(({index, violations}) => (
                                                <ControlReqViolationBlock key={index} index={index} violations={violations} />
                                            ))
                                            :
                                            <div className="no-violations-msg">
                                                <AiOutlineCheckCircle className="no-violations-icon" size={60}/>
                                                <span className="no-violations-msg-text">No violations found in snapshot.</span>
                                            </div>
                                        }
                                    </>
                                }
                            </>
                            :
                            <div className="no-existing-reqs">
                                <div className="no-existing-reqs-msg">
                                    No existing Snapshots to check. Please create a new File Snapshot before attempting
                                    again.
                                </div>
                            </div>
                        }
                    </>
                    :
                    <div className="no-existing-reqs">
                        <div className="no-existing-reqs-msg">
                            No existing User Access Control Requirements to check. Please create a new User Access
                            Control Requirement before attempting again.
                        </div>
                    </div>
                }
            </div>
        </>
    );
}