import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import "../index.css";
import React, {useContext, useState} from "react";
import {UserContext} from "../../../utils/context/UserContext";
import {AiOutlinePlus} from "react-icons/ai";
import UploadGroupModal from "../../modals/UploadGroupModal/UploadGroupModal";
import GroupSnapCell from "./GroupSnapCell/GroupSnapCell";
import "../SnapshotPages.css";

export default function GroupSnapshots() {
    const {groupSnapshots} = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);

    console.log(groupSnapshots)

    const handleToggleModal = () => {
        setShowModal(!showModal)
    }
    
    return (
        <>
            <div className="page-container">
                <PageSideBar />
                <div className="page-content">
                    <h2 className="page-content-header">Group Snapshots</h2>
                    <div className="snapshot-page-buttons">
                        <button className="snapshot-page-button" onClick={handleToggleModal}>
                            <AiOutlinePlus size={20} />
                            Upload Group Membership
                        </button>
                    </div>
                    {groupSnapshots.length > 0 &&
                        <>
                            <h3 className="category-title">Current Group Snapshot:</h3>
                            <GroupSnapCell snapInfo={groupSnapshots[0]}/>
                            <h3 className="category-title">Group Snapshot History:</h3>
                            <div> {groupSnapshots.slice(1).map((snap) => (
                                <GroupSnapCell
                                    key={snap._id}
                                    snapInfo={snap}
                                />
                            ))} </div>
                        </>
                    }
                </div>
            </div>
            {showModal &&
                <UploadGroupModal
                    toggleModal={handleToggleModal}
                />
            }
        </>
    );
}