import React from 'react';
import {MdOutlineError} from "react-icons/md";
import "./AnalyzeSharingInfoCell.css";

export default function AnalyzeSharingInfoCell(props) {
    const {cellInfo, infoType, fileName} = props

    // if information is about file folder diff
    if (infoType === "ff") {
        const {type, folder, file, folder_role, file_role, perm_name} = cellInfo
        return (
            <div className="analysis-block">
                <div className="analysis-icon-container">
                    <MdOutlineError className="violations-icon" size={25} />
                </div>
                <div>
                    <div>
                        <div className="analysis-info-text-label">Folder: </div>
                            <div className="analysis-info-text" >{folder}</div>
                        </div>
                    <div>
                        <div className="analysis-info-text-label">File: </div>
                        <div className="analysis-info-text" >{file}</div>
                    </div>
                    <div>
                        <div className="analysis-info-text-label">User: </div>
                        <div className="analysis-info-text" >{perm_name}</div>
                    </div>
                    {
                        type === "diff" &&
                        <>
                            <div>
                                <div className="analysis-info-text-label">Folder Role: </div>
                                <div className="analysis-info-text" >{folder_role}</div>
                                
                            </div>
                            <div>
                                <div className="analysis-info-text-label">File Role: </div>
                                <div className="analysis-info-text" >{file_role}</div>
                            </div>
                        </>
                    }
                </div>
            </div>
        )
    }
    else if (infoType === "dev") {
        return (
            <div className="analysis-block">
                <div className="analysis-icon-container">
                    <MdOutlineError className="violations-icon" size={25} />
                </div>
                <div className="deviant-sharing-list">
                    <div className="analysis-info-text-label analysis-info-text-file-name">{fileName}</div>
                    <div>
                        {cellInfo.map((dif) => (
                            <div className="deviant-sharing-user">
                                <div className="deviant-sharing-info-block">
                                    <div className="analysis-info-text-label">Perm Target: </div>
                                    <div className="analysis-info-text" >{dif[0].displayName}</div>
                                </div>
                                <div className="deviant-sharing-info-block">
                                    <div className="analysis-info-text-label">Difference: </div>
                                    <div className="analysis-info-text" >{dif[1]}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }


    return null;
}