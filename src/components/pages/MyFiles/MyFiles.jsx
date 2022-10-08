import React, {useContext, useEffect, useState} from 'react';
import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import "../index.css";
import FileCell from "../../common-page-components/FileCell/FileCell";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import FileInfoSideBar from "../../common-page-components/FileInfoSideBar/FileInfoSideBar";

export default function MyFiles() {
    const { myFiles } = useContext(GoogleContext)
    const [filesList, setFilesList] = useState([]);
    const [foldersList, setFoldersList] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([])

    console.log(selectedFiles);

    useEffect(() => {
        if (!myFiles) {
            return
        }
        let file = myFiles.filter(file => file.type !== "folder")
        let folder = myFiles.filter(file => file.type === "folder")
        setFilesList(file)
        setFoldersList(folder)
    }, [myFiles])

    const handleFileClick = (fileId) => {
        let fileIds = JSON.parse(JSON.stringify(selectedFiles));
        let indexFound = fileIds.findIndex(id => id === fileId);
        if (indexFound !== -1) {
            fileIds.splice(indexFound, 1);
        }
        else {
            fileIds.push(fileId);
        }
        setSelectedFiles(fileIds);
    }

    const handleCloseSidebar = () => {
        setSelectedFiles([]);
    }

    return (
        <div className="page-container">
            <PageSideBar />
            <div className="page-content">
                <h2 className="page-content-header">My Files</h2>
                {filesList &&
                    <>
                        <h3 className="category-title">Files</h3>
                        <div className="category-list">
                            {
                                filesList.map((file) => (
                                    <FileCell key={file.id} fileInfo={file} toggleInfo={handleFileClick} toggled={selectedFiles.includes(file.id)} />
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
                                    <FileCell key={folder.id} fileInfo={folder} toggleInfo={handleFileClick} toggled={selectedFiles.includes(folder.id)} />
                                ))
                            }
                        </div>
                    </>
                }
            </div>
            <FileInfoSideBar filesIds={selectedFiles} shared={false} closeInfo={handleCloseSidebar} />
        </div>
    );
}