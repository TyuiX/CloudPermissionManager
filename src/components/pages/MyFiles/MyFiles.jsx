import React, {useContext, useEffect, useState} from 'react';
import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import "../index.css";
import {
    addPermissionForUser,
    getPermissionsStart,
    updatePermissionsStart
} from "../../../api/GoogleAPI";
import FileCell from "../../common-page-components/FileCell/FileCell";
import {GoogleContext} from "../../../utils/context/GoogleContext";

export default function MyFiles() {
    const { myFiles } = useContext(GoogleContext)
    const [filesList, setFilesList] = useState([]);
    const [foldersList, setFoldersList] = useState([]);

    useEffect(() => {
        if (!myFiles) {
            return
        }
        let file = myFiles.filter(file => file.type !== "folder")
        let folder = myFiles.filter(file => file.type === "folder")
        setFilesList(file)
        setFoldersList(folder)
    }, [myFiles])

    return (
        <div className="page-container">
            {/*<button onClick={() => getPermissionsStart("13eaUn538pj-g1Yr_EoNEoS3kHqU98rvJSWm5RDbZOqs")}>showPerm</button>*/}
            {/*<button onClick={() => updatePermissionsStart("13eaUn538pj-g1Yr_EoNEoS3kHqU98rvJSWm5RDbZOqs", "13084050885625841573")}>upatePerm</button>*/}
            {/*<button onClick={() => addPermissionForUser("1xxxJyk8BFeM7rsY4w_kZE-xa0olPAGihgsoHQ0mOeRo")}>upatePerm</button>*/}
            <PageSideBar />
            <div className="page-content">
                <h2 className="page-content-header">My Files</h2>
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