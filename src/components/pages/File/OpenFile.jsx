import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {addPermissionForUser, getPermissionsStart, updatePermissionsStart} from "../../../api/GoogleAPI";
import {gapi} from "gapi-script";
import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import PermissionsCell from "./PermissionsCell/PermissionsCell";

export default function OpenFile() {
    const {fileId} = useParams();
    const [permissions, setPermissions] = useState([])
    console.log(fileId)
    const auth = gapi.auth


    useEffect(() => {
        if (!auth) {
            return
        }
        const getPerms = async () => {
            let perms = await getPermissionsStart(fileId)
            console.log(perms)
            setPermissions(perms)
        }
        getPerms();

    }, [auth, fileId])

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