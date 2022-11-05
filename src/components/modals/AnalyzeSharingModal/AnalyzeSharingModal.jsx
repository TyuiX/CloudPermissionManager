import React, {useContext, useEffect, useState} from 'react';
import {AiOutlineClose} from "react-icons/ai";
import "../index.css";
import "./AnalyzeSharingModal.css";
import {UserContext} from "../../../utils/context/UserContext";
import AnalyzeSharingInfoCell from "./AnalyzeSharingInfoCell/AnalyzeSharingInfoCell";

export default function AnalyzeSharingModal(props) {
    const {toggleModal, analysisType} = props;
    const {snapshots, getFolderFileDif, getSnapShotDiff, getDeviantFiles} = useContext(UserContext);
    const [selectedSnap, setSelectedSnap] = useState({});
    const [selectedSecondSnap, setSelectedSecondSnap] = useState({});
    const [fileFolderDiff, setFileFolderDiff] = useState([])
    const [deviantSharing, setDeviantSharing] = useState([])
    const [snapshotDiff, setSnapshotDiff] = useState([])

    console.log(selectedSnap)
    console.log(selectedSecondSnap)

    useEffect(() => {
        if (snapshots.length <= 0) {
            return
        }
        // set default snapshot to current/most recent
        setSelectedSnap(snapshots[0])
        setSelectedSecondSnap(snapshots[0])
    },[snapshots])

    // handle file folder diff and deviant sharing calls
    const handleAnalyzeSnapshot = async (e) => {
        e.preventDefault();
        if (analysisType === "analysis") {
            // await getting both analyze sharing and deviant sharing information
            const [res1, res2] = await Promise.all([getFolderFileDif(selectedSnap._id), getDeviantFiles(selectedSnap)])
            setFileFolderDiff(res1);
            setDeviantSharing(res2);
        } else {
            // pass two selected snapshots to backend and await return
            let data = await getSnapShotDiff(selectedSnap, selectedSecondSnap);
            setSnapshotDiff(data)
        }



    }

    // handle selection of snapshots
    const handleSnapshotSelect = (e, first) => {
        e.preventDefault()
        let found = snapshots.find(({_id}) => _id ===  e.target.value)
        if (found) {
            // check if first or second snapshot selection changed
            if (first) {
                setSelectedSnap(found);
            } else {
                setSelectedSecondSnap(found)
            }
        }
    }

    console.log(analysisInfo);
    return (
        <div className="modal-background">
            <div className="modal-container">
                <div className="modal-header">
                    <span>Analysis</span>
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
                <div className="select-analysis-snapshot-header">
                    <div className="select-snapshot-selections-container">
                        <div className="analysis-select-snapshot-container">
                            <div>{analysisType === "compare" && "First "}Snapshot:</div>
                            <select onChange={(e) => handleSnapshotSelect(e, true)}>
                                {
                                    snapshots.map(({_id}) => (
                                        <option key={_id} value={_id}>{_id}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {analysisType === "compare" &&
                            <div className="analysis-select-snapshot-container">
                                <div>Second Snapshot:</div>
                                <select onChange={(e) => handleSnapshotSelect(e, false)}>
                                    {
                                        snapshots.map(({_id}) => (
                                            <option key={_id} value={_id}>{_id}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        }
                    </div>
                    <button className="select-analysis-snapshot-button" onClick={(e) => handleAnalyzeSnapshot(e)}>
                        {analysisType === "analysis" ? "Analyze " : "Compare "}Snapshot
                    </button>
                </div>
                <div className="modal-section">
                    <div className="modal-section-title">{analysisType === "analysis" ? "File Folder" : "Snapshot"} Sharing Differences:</div>
                    <div className={analysisType === "analysis" ? "analysis-list-container" : "snapshot-diff-list-container"}>
                        {fileFolderDiff.length > 0 &&
                            fileFolderDiff.map((info, index) =>
                                <AnalyzeSharingInfoCell key={index} cellInfo={info} infoType={"ff"} />
                            )
                        }
                        {snapshotDiff.length > 0 &&
                            snapshotDiff.map(({type, file_name, perm_id, perm_name, perm_role, new_role, old_role}, index) =>
                                <div key={perm_id + index} className="analysis-block">
                                    {type}
                                    <div>File: {file_name}</div>
                                    <div>User: {perm_name}</div>
                                    {
                                        type === "new perm" &&
                                        <>
                                            <div>Role: {perm_role}</div>
                                        </>
                                    }
                                    {
                                        type === "change perm" &&
                                        <>
                                            <div>Old Role: {old_role}</div>
                                            <div>New Role: {new_role}</div>
                                        </>
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                {analysisType === "analysis" &&
                    <div className="modal-section">
                        <div className="modal-section-title">Deviant Sharing</div>
                        {deviantSharing.length > 0 &&
                            <div className="analysis-list-container">
                                {deviantSharing.map(({fileName, diffPer}) => (
                                    <div className="analysis-block">
                                        <div>{fileName}</div>
                                        {
                                            diffPer.map((dif) => (
                                                <div>
                                                    <div>Permission target: {dif[0].displayName}</div>
                                                    <div>Difference: {dif[1]}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    );
}