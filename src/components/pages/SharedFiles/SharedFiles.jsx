import React, {useContext, useEffect, useState} from 'react';
import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import "../index.css";
import FileCell from "../../common-page-components/FileCell/FileCell";
import {GoogleContext} from "../../../utils/context/GoogleContext";

export default function SharedFiles() {
    const { sharedFiles } = useContext(GoogleContext)
    const [filesList, setFilesList] = useState([]);
    const [foldersList, setFoldersList] = useState([]);

    useEffect(() => {
        if (!sharedFiles) {
            return
        }
        let file = sharedFiles.filter(file => file.type !== "folder")
        let folder = sharedFiles.filter(file => file.type === "folder")
        setFilesList(file)
        setFoldersList(folder)
    }, [sharedFiles])

    return (
        <div className="page-container">
            <PageSideBar />
            <div className="page-content">
                <h2 className="page-content-header">Shared with me</h2>
                {filesList &&
                    <>
                        <h3 className="category-title">Files</h3>
                        <div className="category-list">
                            {
                                filesList.map((file) => (
                                    <FileCell key={file.id} fileInfo={file} />
                                ))
                            }
                        </div>
                    </>
                }
                {foldersList &&
                    <>
                        <h3 className="category-title">Folders</h3>
                        <div className="category-list">
                            {
                                foldersList.map((folder) => (
                                    <FileCell key={folder.id} fileInfo={folder} />
                                ))
                            }
                        </div>
                    </>
                }
            </div>
        </div>
    );
}