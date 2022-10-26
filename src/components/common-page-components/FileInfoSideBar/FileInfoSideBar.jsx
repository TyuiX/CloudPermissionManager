import React, {useContext, useEffect, useState} from 'react';
import "./FileInfoSideBar.css";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import {AiOutlineClose} from "react-icons/ai";
import FileInfoBlock from "./FileInfoBlock/FileInfoBlock";
import UpdateMultipleSharingModal from "../../modals/UpdateMultipleSharingModal/UpdateMultipleSharingModal";

export default function FileInfoSideBar(props) {
    const {filesIds, shared, closeInfo} = props;
    const [filesToDisplay, setFilesToDisplay] = useState([]);
    const {allFiles} = useContext(GoogleContext);
    const [showModal, setShowModal] = useState(false);

    const handleToggleModal = () => {
        setShowModal(!showModal)
    }

    useEffect(() => {
        if (!filesIds) {
            return
        }
        let displayFiles = allFiles.filter(({id}) => filesIds.includes(id))
        setFilesToDisplay(displayFiles)
    }, [filesIds, allFiles])

    return (
        <>
            {
                filesIds.length !== 0 &&
                <div className="file-info-sidebar-container">
                    <div className="info-sidebar-header">
                        <span>File Information</span>
                        <AiOutlineClose className="sidebar-close-button" onClick={closeInfo} />
                    </div>
                    {filesToDisplay.length > 1 && !shared &&
                        <div className="sidebar-update-all-button-container">
                            <button
                                className="sidebar-update-all-button"
                                onClick={handleToggleModal}
                            >
                                Update All Selected Files
                            </button>
                        </div>
                    }
                    {
                        filesToDisplay.map((file) => (
                            <FileInfoBlock key={file.id} fileInfo={file} shared={shared} closeInfo={closeInfo}/>
                        ))
                    }
                </div>
            }
            {showModal &&
                <UpdateMultipleSharingModal files={filesToDisplay} toggleModal={handleToggleModal} closeInfo={closeInfo}/>
            }
        </>
    );
}