import React from 'react';
import {AiOutlineClose} from "react-icons/ai";
import "../index.css";
import "./AnalyzeSharingModal.css";

export default function AnalyzeSharingModal(props) {
    const {toggleModal, analysisInfo, analysisType} = props;

    return (
        <div className="modal-background">
            <div className="modal-container">
                <div className="modal-header">
                    <span>Analysis</span>
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
                <div className="modal-section">
                    <div className="modal-section-title">{analysisType === "file-folder" ? "File Folder" : analysisType === "snapshot-change" ? "Snapshot": "Deviant"} Sharing Differences:</div>
                    {analysisInfo &&
                        <div className="analysis-list-container">
                            {analysisType === "file-folder" ?
                                analysisInfo.map(({type, folder, file, folder_role, file_role, perm_name}, index) =>
                                    <div key={perm_name + file + index} className="analysis-block">
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
                                : analysisType === "snapshot-change" ?
                                    analysisInfo.map(({type, file_name, perm_id, perm_name, perm_role, new_role, old_role}, index) =>
                                    <div key={perm_id + index} className="analysis-block">
                                        {type}
                                        <div>File: {file_name}</div>
                                        <div>User: {perm_name}</div>
                                        {
                                            type === "new perm" &&
                                            <>
                                                <div>Role: {perm_role}</div>
                                            </>
                                        }
                                        {
                                            type === "change perm" &&
                                            <>
                                                <div>Old Role: {old_role}</div>
                                                <div>New Role: {new_role}</div>
                                            </>
                                        }
                                    </div>
                                )
                                :
                                analysisInfo.map(({fileName, diffPer}) => {
                                    return (
                                      <div className="analysis-block">
                                        <div>{fileName}</div>
                                        {
                                          diffPer.map((dif) => (
                                              <div><div>Permission target: {dif[0].displayName}</div>
                                              <div>Difference: {dif[1]}</div></div>
                                          ))
                                        }
                                      </div>
                                    )
                                  })
                                
                            }
                        </div>
                    }
                </div>
                {/*<div className="modal-section">*/}
                {/*    <div className="modal-section-title">Sharing Differences:</div>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}