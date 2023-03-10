import React, {useContext, useEffect, useState} from 'react';
import {AiOutlineClose} from "react-icons/ai";
import "../index.css";
import "./AnalyzeSharingModal.css";
import ReactSlider from 'react-slider'
import {UserContext} from "../../../utils/context/UserContext";
import AnalyzeSharingInfoCell from "./AnalyzeSharingInfoCell/AnalyzeSharingInfoCell";
import FileFolderSharingDiffList from "./FileFolderSharingDiffList/FileFolderSharingDiffList";
import SnapshotDiffList from "./SnapshotDiffList";

export default function AnalyzeSharingModal(props) {
    const {toggleModal, analysisType, isGoogle} = props;
    const {snapshots, getFolderFileDif, getSnapShotDiff, getDeviantFiles, oneDriveSnapshots, getODFolderFileDif, getODSnapShotDiff, getODDeviantFiles } = useContext(UserContext);
    const [selectedSnap, setSelectedSnap] = useState({});
    const [selectedSecondSnap, setSelectedSecondSnap] = useState({});
    const [fileFolderDiff, setFileFolderDiff] = useState([])
    const [deviantSharing, setDeviantSharing] = useState([])
    const [snapshotDiff, setSnapshotDiff] = useState([])
    const [threshold, setThreshold] = useState(0.8)
    const[currentSnapshots, setCurrentSnapshots] = useState(isGoogle?snapshots:oneDriveSnapshots)
    // setCurrentSnapshots(isGoogle?snapshots:oneDriveSnapshots);
    // console.log(currentSnapshots);

    useEffect(() => {
        setCurrentSnapshots(isGoogle?snapshots:oneDriveSnapshots);
        if (currentSnapshots.length <= 0) {
            return
        }
        // set default snapshot to current/most recent
        setSelectedSnap(currentSnapshots[0])
        setSelectedSecondSnap(currentSnapshots[0])
    },[isGoogle?snapshots:oneDriveSnapshots])

    // handle file folder diff and deviant sharing calls
    const handleAnalyzeSnapshot = async (e) => {
        e.preventDefault();
        if (analysisType === "analysis") {
            // await getting both analyze sharing and deviant sharing information
            let [res1, res2] = [[],[]];
            if(isGoogle){
                [res1, res2] = await Promise.all([getFolderFileDif(selectedSnap._id), getDeviantFiles(selectedSnap, threshold)])
                console.log(res1, res2);
            }
            else{
                // console.log(getODFolderFileDif(selectedSnap._id));
                // console.log(getODDeviantFiles(selectedSnap, threshold));
                [res1, res2] = await Promise.all([getODFolderFileDif(selectedSnap._id), getODDeviantFiles(selectedSnap, threshold)])
                console.log(res1, res2);
            }
            setFileFolderDiff({
                "Different Permissions": res1.filter(({type}) => type === "diff"),
                "Extra Permissions": res1.filter(({type}) => type === "extra"),
                "Missing Permissions": res1.filter(({type}) => type === "missing"),
                size: res1.length
            });
            setDeviantSharing(res2);
        } else {
            // pass two selected snapshots to backend and await return
            let data = [];
            if(isGoogle){
                data = await getSnapShotDiff(selectedSnap, selectedSecondSnap);
            }
            else{
                // console.log(getODSnapShotDiff(selectedSnap, selectedSecondSnap));
                data = await getODSnapShotDiff(selectedSnap, selectedSecondSnap);
            }
            console.log(data)

            setSnapshotDiff({
                "New Files": data.filter(({type}) => type === "new file"),
                "New Permissions": data.filter(({type}) => type === "new perm"),
                "Changed Permissions": data.filter(({type}) => type === "change perm"),
                "Deleted Permissions": data.filter(({type}) => type === "deleted perm"),
                size: data.length
            })
        }
    }

    // handle selection of snapshots
    const handleSnapshotSelect = (e, first) => {
        e.preventDefault()
        let found = currentSnapshots.find(({_id}) => _id ===  e.target.value)
        if (found) {
            // check if first or second snapshot selection changed
            if (first) {
                setSelectedSnap(found);
            } else {
                setSelectedSecondSnap(found)
            }
        }
    }

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
                            <div className="analysis-option-label">{analysisType === "compare" && "First "}Snapshot:</div>
                            <select onChange={(e) => handleSnapshotSelect(e, true)}>
                                {
                                    currentSnapshots.map(({_id}) => (
                                        <option key={_id} value={_id}>{_id}</option>
                                    ))
                                }
                            </select>
                        </div>
                        { analysisType === "analysis" &&
                            <div className="analysis-select-snapshot-container">
                                <div className="analysis-option-label">Deviant Threshold:</div>
                                <ReactSlider
                                    className="deviant-slider"
                                    thumbClassName="slider-thumb"
                                    trackClassName="slider-track"
                                    min={51}
                                    max={100}
                                    defaultValue={80}
                                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                    onChange={(value) => setThreshold(value / 100.0)}
                                />
                            </div>
                        }
                        {analysisType === "compare" &&
                            <div className="analysis-select-snapshot-container">
                                <div className="analysis-option-label">Second Snapshot:</div>
                                <select onChange={(e) => handleSnapshotSelect(e, false)}>
                                    {
                                        currentSnapshots.map(({_id}) => (
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
                        {fileFolderDiff.size > 0 &&
                            <FileFolderSharingDiffList diffInfo={fileFolderDiff} />
                        }
                        {snapshotDiff.size > 0 &&
                            <SnapshotDiffList diffInfo={snapshotDiff} />
                        }
                    </div>
                </div>
                {analysisType === "analysis" &&
                    <div className="modal-section">
                        <div className="modal-section-title">Deviant Sharing</div>
                        {deviantSharing.length > 0 &&
                            <div className="analysis-list-container">
                                {deviantSharing.map(({fileName, diffPer}, index) => (
                                    <AnalyzeSharingInfoCell key={index} cellInfo={diffPer} infoType={"dev"} fileName={fileName} />
                                ))}
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    );
}