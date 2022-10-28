import React, {useContext, useState} from 'react';
import {UserContext} from "../../../../utils/context/UserContext";
import "./CheckControlReqModalPage.css";
import {AiOutlineCheckCircle} from "react-icons/ai";
import ControlReqViolationBlock from "./ControlReqViolationBlock/ControlReqViolationBlock";

const QUERIES_MAP = {
    "drive": "drive:drive",
    "owner": "owner:user",
    "creator": "creator:user",
    "from": "from:user",
    "to": "to:user",
    "readable": "readable:user",
    "writeable": "writeable:user",
    "shareable": "shareable:user",
    "name": "name:regexp",
    "inFolder": "inFolder:regexp",
    "folder": "folder:regexp",
    "path": "path:path",
    "sharing:none": "sharing:none",
    "sharing:anyone": "sharing:anyone",
    "sharing:individual": "sharing:individual",
    "sharing:domain": "sharing:domain"
}


export default function CheckControlReqModalPage(props) {
    const {performSearch, controlReqs, snapshots} = useContext(UserContext);
    const [selectedSnap, setSelectedSnap] = useState(snapshots.length !== 0 ? snapshots[0] : {});
    const [violations, setViolations] = useState([]);
    const [searchedViolations, setSearchedViolations] = useState(false)

    console.log(violations)
    console.log(searchedViolations)

    const handleSnapshotClick = (e) => {
        e.preventDefault()
        let found = snapshots.find(({_id}) => _id ===  e.target.value)
        if (found) {
            setSelectedSnap(found);
        }
    }

    const checkViolations = (permissions, fileName, req, violationsList) => {
        const {aw, ar, dw, dr, grp} = req;
        if (!permissions) {
            return;
        }
        permissions.forEach(({emailAddress, role}) => {
            let currentViol = {
                file: fileName,
                user: emailAddress,
                role: role,
            }
            if (role === "owner") {
                return;
            }
            if (role === "reader" || role === "commenter") {
                if (dr.emails.length > 0 || dr.domains.length > 0) {
                    if (dr.emails.includes(emailAddress) || checkInDomains(emailAddress, dr.domains)) {
                        currentViol.violation = "Denied Reader";
                    }
                }
                else if (ar.emails.length > 0 || ar.domains.length > 0) {
                    if (!ar.emails.includes(emailAddress) && !checkInDomains(emailAddress, ar.domains)) {
                        currentViol.violation = "Allowed Reader";
                    }
                }
            }
            else if (role === "writer" || role === "editor") {
                if (dw.emails.length > 0 || dw.domains.length > 0) {
                    if (dw.emails.includes(emailAddress) || checkInDomains(emailAddress, dw.domains)) {
                        currentViol.violation = "Denied Writer";
                    }
                }
                else if (aw.emails.length > 0 || aw.domains.length > 0) {
                    if (!aw.emails.includes(emailAddress) && !checkInDomains(emailAddress, aw.domains)) {
                        currentViol.violation = "Allowed Writer";
                    }
                }
            }
            if (!violationsList.violations.includes(currentViol) && currentViol.hasOwnProperty("violation")) {
                violationsList.violations.push(currentViol)
            }
        })
    }

    const checkInDomains = (user, domains) => {
        let found = domains.find(domain => user.endsWith(domain))
        return !!found;
    }

    const handleCheckReq = async (e) => {
        e.preventDefault();
        let reqViolations = [];
        for (const req of controlReqs) {
            const index = controlReqs.indexOf(req);
            let queryMap = new Map();
            const {query} = req;
            let currentViolations = {
                index: index + 1,
                violations: [],
            }
            let splitQueryOps = query.split(" ");
            splitQueryOps.forEach(query => {
                let queryParts = query.split(":");
                if (queryParts.length <= 1) {
                    return
                }
                if (Object.hasOwn(QUERIES_MAP, queryParts[0])) {
                    // TODO this is just for while sharing isnt implemented
                    if (queryParts[0] === "sharing") {
                        return;
                    }
                    const [, ...operand] = queryParts
                    queryMap.set(QUERIES_MAP[queryParts[0]], operand.join(":"))
                }
            })
            let searchResults = await performSearch(selectedSnap, queryMap, false)
            searchResults.forEach(({name, permissions}) => {
                checkViolations(permissions, name, req, currentViolations)
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
                                                <ControlReqViolationBlock index={index} violations={violations} />
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