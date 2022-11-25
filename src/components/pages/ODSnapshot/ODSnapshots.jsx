import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import SnapCell from "../Snapshot/SnapCell/SnapCell";
import "../index.css";
import React, {useContext, useState} from "react";
import {OneDriveContext} from "../../../utils/context/OneDriveContext";
import {UserContext} from "../../../utils/context/UserContext";
import AnalyzeSharingModal from "../../modals/AnalyzeSharingModal/AnalyzeSharingModal";
import "../SnapshotPages.css";
import {AiOutlinePlus} from "react-icons/ai";
import { createOneDriveSnapshot } from "../OneDriveAuth/graph";

export default function ODSnapshots(){
    const {allFiles, accessToken} = useContext(OneDriveContext);
    const {oneDriveSnapshots, createNewSnapshot, user} = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const [analysisType, setAnalysisType] = useState("");
    console.log(oneDriveSnapshots);

    const handleToggleModal = () => {
        setShowModal(!showModal)
    }

    const createSnapshotData = async() =>{
        if(accessToken){
            createOneDriveSnapshot(accessToken, createNewSnapshot, user);
            console.log(oneDriveSnapshots);
        }
        else
            console.log("no  access token");
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

    if (oneDriveSnapshots.length !== 0){
        console.log(oneDriveSnapshots);
        firstSnap = oneDriveSnapshots[0];
        secondSnap = oneDriveSnapshots;
    }

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
                    {oneDriveSnapshots.length > 0 &&
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