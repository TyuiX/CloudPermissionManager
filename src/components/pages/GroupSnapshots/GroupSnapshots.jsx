import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import "../index.css";
import React, {useContext, useState} from "react";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import {UserContext} from "../../../utils/context/UserContext";
import AnalyzeSharingModal from "../../modals/AnalyzeSharingModal/AnalyzeSharingModal";
import {AiOutlinePlus} from "react-icons/ai";
import UploadGroupModal from "../../modals/UploadGroupModal/UploadGroupModal";

export default function GroupSnapshots() {
    const {allFiles} = useContext(GoogleContext);
    const {snapshots, createNewSnapshot} = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    console.log(showModal)
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