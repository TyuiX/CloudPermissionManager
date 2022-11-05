import React from 'react';

export default function AnalyzeSharingInfoCell(props) {
    const {cellInfo, infoType} = props

    // if information is about file folder diff
    if (infoType === "ff") {
        const {type, folder, file, folder_role, file_role, perm_name} = cellInfo
        return (
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

    return null;
}