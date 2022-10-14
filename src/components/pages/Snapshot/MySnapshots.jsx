import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import SnapCell from "./SnapCell/SnapCell";
import "../index.css";
import React, {useContext, useState} from "react";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import {UserContext} from "../../../utils/context/UserContext";
import UpdateSharingModal from "../../modals/UpdateSharingModal/UpdateSharingModal";
import AnalyzeSharingModal from "../../modals/AnalyzeSharingModal/AnalyzeSharingModal";

export default function MySnapshots() {
    const {myFiles} = useContext(GoogleContext);
    const {snapshots, createNewSnapshot, getFolderFileDif, getsnapShotDiff} = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const [analysisInfo, setAnalysisInfo] = useState([])

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

        myFiles.forEach((file) => {
            const {id, parents, permissions} = file;
            if(parents !== undefined) {
                let fileCopy = JSON.parse(JSON.stringify(file));
                let newPerms = new Map();
                for (let perm of permissions) {
                    newPerms.set(perm.id, perm)
                }
                fileCopy.perm = Object.fromEntries(newPerms)
                console.log(fileCopy)

                if (snapshot.folders.has(parents[0])){
                    snapshot.folders.get(parents[0]).set(id, fileCopy)
                }
                else{
                    snapshot.folders.set(parents[0], new Map())
                    snapshot.folders.get(parents[0]).set(id, fileCopy)
                    rootCandidate.add(parents[0])
                }
                if (rootCandidate.has(id)){
                    rootCandidate.delete(id);
                }
            }
        })
        snapshot.root = [...rootCandidate][0]
        let key = snapshot.folders.keys();
        for (let i of key){
            snapshot.folders.set(i , Object.fromEntries(snapshot.folders.get(i)))
        }
        snapshot.folders = Object.fromEntries(snapshot.folders)
        createNewSnapshot(snapshot, user.email)
    }

    const handleCompareFileFolder = async () => {
        let data = await getFolderFileDif(firstSnap._id);
        setAnalysisInfo(data)
        setShowModal(true)
    }

    let firstSnap = null;
    let secondSnap = [];

    if(snapshots.length !== 0){
        console.log(snapshots);
        firstSnap = snapshots[0];
        secondSnap = snapshots;
    }

    let fullDate = "";
    if(firstSnap){
        let date = firstSnap.date;

        let month = date.substring(5, 7);
        let day = date.substring(8, 10);
        let time = date.substring(11, date.length - 5);

        let monthString = "";
        if(month === "10") { monthString = "October"}
        else if(month === "11") { monthString = "November"}
        else if(month === "12") { monthString = "December"}
        fullDate = "Taken on " + monthString + " " + day + ", " + 2022 + " at " + time;
    }

    return (
        <>
            <div className="page-container">
                <PageSideBar />
                <div className="page-content">
                    <h2 className="page-content-header">My Snapshots</h2>
                    {snapshots &&
                        <>
                            <h3 className="category-title">Recent Snapshot:</h3>
                            <p className="page-content-all-the-way"> id: {firstSnap?firstSnap._id:""} <br></br> {fullDate} </p>
                            <h3 className="category-title">Older Snapshots:</h3>
                            <div> {secondSnap.slice(1).map((snap) => (
                                <SnapCell key={snap._id}
                                          snapInfo={snap}
                                />
                            ))} </div>
                        </>
                    }
                    <h2> <button className="newSnap" onClick={createSnapshotData}>Add Snapshot</button></h2>
                    <h2> <button className="newSnap" onClick={handleCompareFileFolder}>FileFolderDiff</button></h2>
                    <h2> <button className="newSnap" onClick={() => getsnapShotDiff(snapshots[1], firstSnap._id)}>SnapshotDiff</button></h2>
                </div>
            </div>
            {showModal &&
                <AnalyzeSharingModal
                    analysisInfo={analysisInfo}
                    toggleModal={handleToggleModal}
                />
            }
        </>
    );
}