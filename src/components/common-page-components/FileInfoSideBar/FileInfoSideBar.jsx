import React, {useContext, useEffect, useState} from 'react';
import "./FileInfoSideBar.css";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import {AiOutlineClose} from "react-icons/ai";
import FileInfoBlock from "./FileInfoBlock/FileInfoBlock";

export default function FileInfoSideBar(props) {
    const {filesIds, shared, closeInfo} = props;
    const [filesToDisplay, setFilesToDisplay] = useState([]);
    const {allFiles} = useContext(GoogleContext);

    console.log(filesToDisplay)

    useEffect(() => {
        if (!filesIds) {
            return
        }
        let displayFiles = allFiles.filter(({id}) => filesIds.includes(id))
        setFilesToDisplay(displayFiles)
    }, [filesIds, allFiles])

    return (
         filesIds.length !== 0 &&
        <div className="file-info-sidebar-container">
            <div className="info-sidebar-header">
                <span>File Information</span>
                <AiOutlineClose className="sidebar-close-button" onClick={closeInfo} />
            </div>
            {!shared &&
                //TODO complete button and create modal to update perms
                <button>Update Access</button>
            }
            {
                filesToDisplay.map((file) => (
                    <FileInfoBlock fileInfo={file}/>
                ))
            }
        </div>
    );
}