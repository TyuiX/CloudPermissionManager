import React from 'react';
import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import "../index.css";
import {getFileToShow, fileTypeNotSupported} from "../../../api/GoogleAPI";
import "./AllFilesPage.css";
import { Route, Routes } from "react-router-dom";

export default function AllFilesPage(props) {
    const {files} = props;
    console.log(files);
    console.log("egbui");

    let fileNames = [];
    let fileIds = [];

    let index = 0;
    while(index < files.length){
        let id = files[index].id;
        let typeOfFile = files[index].mimeType + "";
        typeOfFile = typeOfFile.substring(typeOfFile.lastIndexOf(".") + 1);

        if(typeOfFile === "presentation" || typeOfFile === "document" || typeOfFile === "spreadsheet" || typeOfFile === "site" ){
            let temp = "https://docs.google.com/" + typeOfFile + "/d/" + id;
            fileNames.push(<a href = {temp}><p id = "fileNames">{files[index].name}</p></a>);
        }
        else{
            fileNames.push(<a href = {"#"} onClick={fileTypeNotSupported}><p id = "fileNames">{files[index].name}</p></a>);
        }
    }

    return (
        <div className="page-container">
            <PageSideBar />
            <div className="page-content">
                <div className="page-content-header">All Files</div>
                <div>
                    <div>{fileNames}</div>
                </div>
            </div>
        </div>
    );
}