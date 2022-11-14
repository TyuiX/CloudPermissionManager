import React, {useContext, useState} from 'react';
import PageSideBar from '../../common-page-components/PageSidebar/PageSideBar';
import {UserContext} from "../../../utils/context/UserContext";
import "./SearchResults.css"
import FileInfoSideBar from "../../common-page-components/FileInfoSideBar/FileInfoSideBar";
import SearchResultRowBlock from "./SearchResultRowBlock/SearchResultRowBlock";

const SORTING_OPTIONS = [
    "Last Updated (Desc)", "Last Updated (Asc)", "Creation Date (Desc)", "Creation Date (Asc)",
    "Name (A-Z)","Name (Z-A)", "Owner (A-Z)", "Owner (Z-A)",
]

export default function SearchResults() {
    const {searchResults} = useContext(UserContext);
    const [sortingElem, setSortingElem] = useState("Last Updated (Desc)")
    const [selectedFiles, setSelectedFiles] = useState([]);

    console.log(searchResults)

    const handleCloseSidebar = () => {
        setSelectedFiles([]);
    }

    const handleChecked = (e, fileId) => {
        let fileIds = JSON.parse(JSON.stringify(selectedFiles));
        let indexFound = fileIds.findIndex(id => id === fileId);
        if (e.target.checked) {
            fileIds.push(fileId);
        } else {
            fileIds.splice(indexFound, 1);
        }
        setSelectedFiles(fileIds);
    }

    console.log(selectedFiles)

    const optionSorter = (a, b) => {
        switch (sortingElem) {
            case "Last Updated (Desc)":
                return (a.lastUpdatedOn < b.lastUpdatedOn) ? 1 : (b.lastUpdatedOn < a.lastUpdatedOn) ? -1 : 0;
            case "Last Updated (Asc)":
                return (a.lastUpdatedOn > b.lastUpdatedOn) ? 1 : (b.lastUpdatedOn > a.lastUpdatedOn) ? -1 : 0;
            case "Creation Date (Desc)":
                return (a.createdOn < b.createdOn) ? 1 : (b.createdOn < a.createdOn) ? -1 : 0;
            case "Creation Date (Asc)":
                return (a.createdOn > b.createdOn) ? 1 : (b.createdOn > a.createdOn) ? -1 : 0;
            case "Name (A-Z)":
                return (a.name > b.name) ? 1 : (b.name > a.name) ? -1 : 0;
            case "Name (Z-A)":
                return (a.name < b.name) ? 1 : (b.name < a.name) ? -1 : 0;
            case "Owner (A-Z)":
                return (a.owner > b.owner) ? 1 : (b.owner > a.owner) ? -1 : 0;
            case "Owner (Z-A)":
                return (a.owner < b.owner) ? 1 : (b.owner < a.owner) ? -1 : 0;
        }
    }

    return (
        <>
            <div className="page-container">
                <PageSideBar />
                <div className="page-content">
                    <h2 className="page-content-header">Search Results</h2>
                    <select className="query-builder-select" onChange={(e) => setSortingElem(e.target.value)} value={sortingElem}>
                        {SORTING_OPTIONS.map((option) => (
                            <option>
                                {option}
                            </option>
                        ))}
                    </select>
                    <div className="result-table">
                        <div className="result-table-header">
                            <div className="result-table-header-cell result-select-button"></div>
                            <div className="result-table-header-cell">Name</div>
                            <div className="result-table-header-cell">Owner</div>
                            <div className="result-table-header-cell">Last Updated</div>
                            <div className="result-table-header-cell">Created On</div>
                            <div className="result-table-header-cell more-detail-button">More</div>
                        </div>
                        {searchResults.sort((a,b) => optionSorter(a,b)).map((file) => (
                            <SearchResultRowBlock file={file} addToSelected={handleChecked} />
                        ))}
                    </div>
                </div>
                <FileInfoSideBar
                    filesIds={selectedFiles}
                    shared={false}
                    closeInfo={handleCloseSidebar}
                />
            </div>
        </>
    )
}