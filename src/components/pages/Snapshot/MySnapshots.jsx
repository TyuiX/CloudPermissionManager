import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import SnapCell from "./SnapCell/SnapCell";
import "../index.css";
import React, {useContext, useState} from "react";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import {UserContext} from "../../../utils/context/UserContext";
import AnalyzeSharingModal from "../../modals/AnalyzeSharingModal/AnalyzeSharingModal";
import "../SnapshotPages.css";
import {AiOutlinePlus} from "react-icons/ai";

export default function MySnapshots() {
    const {allFiles} = useContext(GoogleContext);
    const {snapshots, createNewSnapshot} = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const [analysisType, setAnalysisType] = useState("")
    console.log(showModal)
    const handleToggleModal = () => {
        setShowModal(!showModal)
    }

    const createSnapshotData = () => {
        let snapshot = {
            //going be double map structure
            folders: new Map(),
            //root folder id
            root: null
        }
        let rootCandidate = new Set()
        const loggedInUser = localStorage.getItem("user");
        let user
        if (loggedInUser) {
            user = JSON.parse(loggedInUser);
        }
        // console.log(myFiles)

        allFiles.forEach((file) => {
            const {id, parents, permissions} = file;
            console.log(permissions);
            console.log(file);

            if (!parents){
                if (!snapshot.folders.has("orphan")){
                    snapshot.folders.set("orphan", new Map());
                }
                let fileCopy = JSON.parse(JSON.stringify(file));
                let newPerms = new Map();
                
                if (!permissions){
                    fileCopy.perm = {};
                    fileCopy.permissions = [];
                }
                else {
                    for (let perm of permissions) {
                        newPerms.set(perm.id, perm);
                    }
                    fileCopy.perm = Object.fromEntries(newPerms)
                }
                console.log(newPerms);
                fileCopy.perm = Object.fromEntries(newPerms);
                snapshot.folders.get("orphan").set(id, fileCopy);
                
                if (rootCandidate.has(id)){
                    rootCandidate.delete(id);
                }
            }

            else if (parents) {
                let fileCopy = JSON.parse(JSON.stringify(file));
                let newPerms = new Map();
                
                if (!permissions){
                    fileCopy.perm = {};
                    fileCopy.permissions = [];
                }
                else {
                    for (let perm of permissions) {
                        newPerms.set(perm.id, perm);
                    }
                    fileCopy.perm = Object.fromEntries(newPerms)
                }
                
                if (snapshot.folders.has(parents[0])){
                    snapshot.folders.get(parents[0]).set(id, fileCopy)
                }
                else {
                    snapshot.folders.set(parents[0], new Map())
                    snapshot.folders.get(parents[0]).set(id, fileCopy)
                    rootCandidate.add(parents[0])
                }
                if (rootCandidate.has(id)){
                    rootCandidate.delete(id);
                }
            }
        })
        snapshot.root = [...rootCandidate][0];
        let key = snapshot.folders.keys();
        for (let i of key){
            snapshot.folders.set(i , Object.fromEntries(snapshot.folders.get(i)))
        }
        snapshot.folders = Object.fromEntries(snapshot.folders)
        console.log(snapshot)
        // uncomment below
        createNewSnapshot(snapshot, user.email)
    }

    const openAnalyzeSnapshot = async () => {
        setAnalysisType("analysis")
        setShowModal(true)
    }

    const openCompareSnapshots = () => {
        setAnalysisType("compare");
        setShowModal(true);
    }

    let firstSnap = null;
    let secondSnap = [];

    if (snapshots.length !== 0){
        console.log(snapshots);
        firstSnap = snapshots[0];
        secondSnap = snapshots;
    }

    console.log(snapshots)
    
    return (
        <>
            <div className="page-container">
                <PageSideBar />
                <div className="page-content">
                    <h2 className="page-content-header">My Snapshots</h2>
                    <div className="snapshot-page-buttons">
                        <button className="snapshot-page-button" onClick={openAnalyzeSnapshot}>Analyze Snapshot</button>
                        <button className="snapshot-page-button" onClick={openCompareSnapshots}>Compare Snapshots</button>
                        <button className="snapshot-page-button" onClick={createSnapshotData}>
                            <AiOutlinePlus size={20} />
                            Add Snapshot
                        </button>
                    </div>
                    {snapshots.length > 0 &&
                        <>
                            <h3 className="category-title">Current Snapshot:</h3>
                            <SnapCell snapInfo={firstSnap}/>
                            <h3 className="category-title">Snapshot History:</h3>
                            <div> {secondSnap.slice(1).map((snap) => (
                                <SnapCell key={snap._id}
                                          snapInfo={snap}
                                />
                            ))} </div>
                        </>
                    }
                </div>
            </div>
            {showModal &&
                <AnalyzeSharingModal
                    analysisType={analysisType}
                    toggleModal={handleToggleModal}
                />
            }
        </>
    );
}