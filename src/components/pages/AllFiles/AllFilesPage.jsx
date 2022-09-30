import React from 'react';
import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import "../index.css";

export default function AllFilesPage(props) {
    const {files, folders} = props;

    return (
        <div className="page-container">
            <PageSideBar />
            <div className="page-content">
                <div className="page-content-header">All Files</div>
                <div>
                    <div>Files</div>
                    {/*{files.map(file => (*/}
                    {/*    <div>File 1</div>*/}
                    {/*))}*/}
                </div>
            </div>
        </div>
    );
}