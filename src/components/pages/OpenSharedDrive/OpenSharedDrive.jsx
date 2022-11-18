import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import FileCell from "../../common-page-components/FileCell/FileCell";
import FileInfoSideBar from "../../common-page-components/FileInfoSideBar/FileInfoSideBar";

export default function OpenSharedDrive() {
    const params = useParams();
    const {sharedDrives, email} = useContext(GoogleContext)
    const [filesList, setFilesList] = useState([]);
    const [foldersList, setFoldersList] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isOrganizer, setIsOrganizer] = useState(false);

    console.log(isOrganizer)

    useEffect(() => {
        if (!params || !sharedDrives || !email) {
            return
        }
        let drive = sharedDrives.find(({id}) => id === params.driveId);
        let file = drive.sharedFiles.filter(file => file.type !== "folder")
        let folder = drive.sharedFiles.filter(file => file.type === "folder")
        setFilesList(file)
        setFoldersList(folder)
        if (drive.sharedFiles.length > 0) {
            let user = drive.sharedFiles[0].permissions.find(({emailAddress}) => emailAddress === email)
            console.log(user)
            if (user && user.role === "organizer") {
                setIsOrganizer(true)
            } else {
                setIsOrganizer(false)
            }
        }
    },[email, params, sharedDrives])


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
                <h2 className="page-content-header">{`Shared Drive / ${params.driveName}`}</h2>
                {filesList &&
                    <>
                        <h3 className="category-title">Files</h3>
                        <div className="category-list">
                            {
                                filesList.map((file) => (
                                    <FileCell key={file.id}
                                              fileInfo={file}
                                              toggleInfo={handleFileClick}
                                              toggled={selectedFiles.includes(file.id)}
                                    />
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
                                    <FileCell key={folder.id}
                                              fileInfo={folder}
                                              toggleInfo={handleFileClick}
                                              toggled={selectedFiles.includes(folder.id)}
                                    />
                                ))
                            }
                        </div>
                    </>
                }
            </div>
            <FileInfoSideBar
                filesIds={selectedFiles}
                shared={!isOrganizer}
                closeInfo={handleCloseSidebar}
            />
        </div>
    )
}