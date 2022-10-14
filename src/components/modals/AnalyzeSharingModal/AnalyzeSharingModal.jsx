import React from 'react';
import {AiOutlineClose} from "react-icons/ai";
import "../index.css";
import "./AnalyzeSharingModal.css";

export default function AnalyzeSharingModal(props) {
    const {toggleModal, analysisInfo} = props;

    return (
        <div className="modal-background">
            <div className="modal-container">
                <div className="modal-header">
                    <span>Analysis</span>
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
                <div className="modal-section">
                    <div className="modal-section-title">File Folder Sharing Differences:</div>
                    {analysisInfo &&
                        analysisInfo.map(({type, folder, file, folder_role, file_role, perm_name}) =>
                            <div className="analysis-block">
                                {type} permission
                                <div>Folder: {folder}</div>
                                <div>File: {file}</div>
                                <div>User: {perm_name}</div>
                                {
                                    type === "diff" &&
                                    <>
                                        <div>Folder Role: {folder_role}</div>
                                        <div>File Role: {file_role}</div>
                                    </>
                                }
                            </div>
                        )
                    }
                </div>
                <div className="modal-section">
                    <div className="modal-section-title">Sharing Differences:</div>
                </div>
            </div>
        </div>
    );
}