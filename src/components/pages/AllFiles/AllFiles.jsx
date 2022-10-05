import React, {useEffect, useState} from 'react';
import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import "../index.css";
import {
    addPermissionForUser,
    getPermissionsStart,
    updatePermissionsStart
} from "../../../api/GoogleAPI";
import "./AllFiles.css";
import {Link} from "react-router-dom";
import FileCell from "./FileCell/FileCell";

export default function AllFiles(props) {
    const {files} = props;

    return (
        <div className="page-container">
            {/*<button onClick={() => getPermissionsStart("13eaUn538pj-g1Yr_EoNEoS3kHqU98rvJSWm5RDbZOqs")}>showPerm</button>*/}
            {/*<button onClick={() => updatePermissionsStart("13eaUn538pj-g1Yr_EoNEoS3kHqU98rvJSWm5RDbZOqs", "13084050885625841573")}>upatePerm</button>*/}
            {/*<button onClick={() => addPermissionForUser("1xxxJyk8BFeM7rsY4w_kZE-xa0olPAGihgsoHQ0mOeRo")}>upatePerm</button>*/}
            <PageSideBar />
            <div className="page-content">
                <h2 className="page-content-header">All Files</h2>
                <div className="category-list">
                    {files &&
                        files.map((file) => (
                            <FileCell key={file.id} fileInfo={file} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}