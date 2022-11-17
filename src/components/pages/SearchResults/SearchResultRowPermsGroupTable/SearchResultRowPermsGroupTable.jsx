import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../../../../utils/context/UserContext";
import "./SearchResultRowPermsGroupTable.css";

export default function SearchResultRowPermsGroupTable(props) {
    const {perm, snapId} = props
    const {snapshots, groupSnapshots} = useContext(UserContext)
    const [groupMembers, setGroupMembers] = useState([]);
    const [grpMemAvail, setGrpMemAvail] = useState(false);
    const [showMembers, setShowMembers] = useState(false)

    // determine which grp snapshot to use to display members
    useEffect(() => {
        if (!snapId || !perm || !groupSnapshots) {
            return
        }
        const {emailAddress} = perm
        // get selected snapshots timestamp
        let searchedFileSnapTime = new Date(snapshots.find(({_id}) => _id === snapId).date).getTime();
        
        // check if exists a grp snapshot for given email
        if (groupSnapshots.some(({email}) => email === emailAddress)) {
            // filter for current groups snapshots and map their difference in times to file snapshot
            let currentGrpSnaps = groupSnapshots.filter(({email}) => email === emailAddress).map((snap) => {
                const {_id, members, date} = snap
                return (
                    {
                        id: _id,
                        members: Array.from(new Set(members)),
                        timeDiff: Math.abs(searchedFileSnapTime - new Date(date).getTime())
                    }
                )
            })
            // find grp snapshot with the closest timestamp to searched file snapshots timestamp and set members
            setGroupMembers(currentGrpSnaps.reduce(function(prev, curr) {
                return prev.timeDiff < curr.timeDiff ? prev : curr;
            }).members)
            setGrpMemAvail(true)
        } else {
            setGrpMemAvail(false)
        }
    },[groupSnapshots, snapId, perm, snapshots])

    return (
        <>
            <div className="result-perm-table-row">
                <div className="result-perm-table-cell">
                    {perm.displayName}
                </div>
                <div className="result-perm-table-cell">
                    {perm.type !== "domain" ? perm.emailAddress : perm.domain}
                </div>
                <div className="result-perm-table-cell">
                    {perm.role}
                </div>
                <div className="result-perm-table-cell">
                    inheritfunction
                </div>
                <div className="result-perm-table-cell expand-group-mem-button" onClick={() => setShowMembers(!showMembers)}>
                    {showMembers ? "-" : "+"}
                </div>
            </div>
            {showMembers &&
                <div className="result-group-mem-list">
                    {grpMemAvail ?
                        groupMembers.map((member) => (
                                <div className="result-group-mem-item" key={member}>
                                    <div>
                                        {member}
                                    </div>
                                </div>
                            ))
                    :
                        <div className="result-group-mem-item">No snapshot of group exists.</div>
                    }
                </div>
            }
        </>
    );
}