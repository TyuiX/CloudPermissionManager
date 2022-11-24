import React, {useContext, useEffect, useState} from 'react';
import PageSideBar from '../../common-page-components/PageSidebar/PageSideBar';
import {UserContext} from "../../../utils/context/UserContext";
import "./SearchResults.css"
import SearchResultRowBlock from "./SearchResultRowBlock/SearchResultRowBlock";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import UpdateMultipleSharingModal from "../../modals/UpdateMultipleSharingModal/UpdateMultipleSharingModal";

const SORTING_OPTIONS = [
    "Last Updated (Desc)", "Last Updated (Asc)", "Creation Date (Desc)", "Creation Date (Asc)",
    "Name (A-Z)","Name (Z-A)", "Owner (A-Z)", "Owner (Z-A)", "Owned by me (T-F)", "Owned by me (F-T)"
]

export default function SearchResults() {
    const {searchResults} = useContext(UserContext);
    const {allFiles} = useContext(GoogleContext);
    const [sortingElem, setSortingElem] = useState("Last Updated (Desc)")
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filesToUpdate, setFilesToUpdate] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!selectedFiles) {
            return
        }
        let displayFiles = allFiles.filter(({id}) => selectedFiles.includes(id))
        setFilesToUpdate(displayFiles)
    }, [selectedFiles, allFiles])

    const handleToggleModal = () => {
        setShowModal(!showModal)
    }

    // handles adding file to list of files wish to update
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

    // determine how to sort based on options
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
            case "Owned by me (T-F)":
                return (!a.ownedByMe && b.ownedByMe) ? 1 : (!b.ownedByMe && a.ownedByMe) ? -1 : 0;
            case "Owned by me (F-T)":
                return (a.ownedByMe && !b.ownedByMe) ? 1 : (b.ownedByMe && !a.ownedByMe) ? -1 : 0;
        }
    }

    return (
        <>
            <div className="page-container">
                <PageSideBar />
                <div className="page-content">
                    <h2 className="page-content-header">Search Results</h2>
                    <div className="search-result-buttons">
                        <select className="search-result-sort" onChange={(e) => setSortingElem(e.target.value)} value={sortingElem}>
                            {SORTING_OPTIONS.map((option) => (
                                <option key={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <button className="snapshot-page-button" onClick={handleToggleModal}>Update Files</button>
                    </div>
                    <div className="result-table">
                        <div className="result-table-header">
                            <div className="result-table-header-cell result-select-button"></div>
                            <div className="result-table-header-cell">Name</div>
                            <div className="result-table-header-cell">Owner</div>
                            <div className="result-table-header-cell">Last Updated</div>
                            <div className="result-table-header-cell">Created On</div>
                            <div className="result-table-header-cell more-detail-button">More</div>
                        </div>
                        {searchResults.results.sort((a,b) => optionSorter(a,b)).map((file, index) => (
                            <SearchResultRowBlock key={index} file={file} addToSelected={handleChecked} snapId={searchResults.snapshot} />
                        ))}
                    </div>
                </div>
            </div>
            {showModal && filesToUpdate.length > 0 &&
                <UpdateMultipleSharingModal files={filesToUpdate} toggleModal={handleToggleModal} />
            }
        </>
    )
}