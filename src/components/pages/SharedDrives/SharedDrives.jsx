import React, {useContext} from 'react';
import {GoogleContext} from "../../../utils/context/GoogleContext";
import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import FileCell from "../../common-page-components/FileCell/FileCell";

export default function SharedDrives() {
    const {sharedDrives} = useContext(GoogleContext)

    console.log(sharedDrives)

    return (
        <div className="page-container">
            <PageSideBar />
            <div className="page-content">
                <h2 className="page-content-header">Shared Drives</h2>
                {sharedDrives &&
                    <>
                        <h3 className="category-title">Drives</h3>
                        <div className="category-list">
                            {
                                sharedDrives.map((drive) => (
                                    <FileCell
                                        key={drive.id}
                                        fileInfo={drive}
                                        type={"drive"}
                                    />
                                ))
                            }
                        </div>
                    </>
                }
            </div>
        </div>
    );
}