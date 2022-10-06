import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import PermissionsCell from "../../common-page-components/PermissionsCell/PermissionsCell";
import {GoogleContext} from "../../../utils/context/GoogleContext";

export default function OpenFile() {
    const {fileId} = useParams();
    const [permissions, setPermissions] = useState([]);
    const [fileInfo, setFileInfo] = useState({});
    const { allFiles } = useContext(GoogleContext);


    useEffect(() => {
        if (!allFiles) {
            return;
        }
        let fileInfo = allFiles.find(file => file.id === fileId);
        if (fileInfo.permissions) {
            setPermissions(fileInfo.permissions)
        }
        setFileInfo(fileInfo);

    }, [allFiles, fileId])

    return (
        <div className="page-container">
            <PageSideBar />
            <div className="page-content-container">
                <h2 className="page-content-header">{fileId}</h2>
                <h3 className="category-title">Users</h3>
                <div className="category-list">
                    {permissions &&
                        permissions.filter(perm => perm.type === "user").map((perm) => (
                            <PermissionsCell permsInfo={perm} type={"user"} />
                        ))
                    }
                </div>
                {/*<h3 className="category-title">Groups</h3>*/}
                {/*<div className="category-list">*/}
                {/*    {permissions &&*/}
                {/*        permissions.filter(perm => perm.type === "user").map((perm) => (*/}
                {/*            <PermissionsCell permsInfo={perm} type={"user"} />*/}
                {/*        ))*/}
                {/*    }*/}
                {/*</div>*/}
                {/*<h3 className="category-title">Anyone</h3>*/}
                {/*<div className="category-list">*/}
                {/*    {permissions &&*/}
                {/*        permissions.filter(perm => perm.type === "user").map((perm) => (*/}
                {/*            <PermissionsCell permsInfo={perm} type={"user"} />*/}
                {/*        ))*/}
                {/*    }*/}
                {/*</div>*/}
            </div>
        </div>
    )
}