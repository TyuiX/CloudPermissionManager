import React, {useContext, useState} from 'react';
import PageSideBar from '../../common-page-components/PageSidebar/PageSideBar';
import {UserContext} from "../../../utils/context/UserContext";
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import "./SearchResults.css"
import MetaData from './MetaData';

const SORTING_OPTIONS = [
    "Last Updated (Desc)", "Last Updated (Asc)", "Creation Date (Desc)", "Creation Date (Asc)",
    "Name (A-Z)","Name (Z-A)", "Owner (A-Z)", "Owner (Z-A)",
]

export default function SearchResults() {
    const {searchResults, groupSnapshots} = useContext(UserContext);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const [createdOn, setCreatedOn] = useState([]);
    const [sortingElem, setSortingElem] = useState("Last Updated (Desc)")

    console.log(searchResults)

    const handleToggleModal = () => {
        setShowModal(!showModal);
    }

    const setPermsAndToggle = (permissions, createdAt) => {
        setPermissions(permissions);
        setCreatedOn(createdAt);
        handleToggleModal();
    }

    const optionSorter = (a, b) => {
        switch (sortingElem) {
            case "Last Updated (Desc)":
                return (a.lastUpdatedOn > b.lastUpdatedOn) ? 1 : (b.lastUpdatedOn > a.lastUpdatedOn) ? -1 : 0;
            case "Last Updated (Asc)":
                return (a.lastUpdatedOn < b.lastUpdatedOn) ? 1 : (b.lastUpdatedOn < a.lastUpdatedOn) ? -1 : 0;
            case "Creation Date (Desc)":
                return (a.createdOn > b.createdOn) ? 1 : (b.createdOn > a.createdOn) ? -1 : 0;
            case "Creation Date (Asc)":
                return (a.createdOn < b.createdOn) ? 1 : (b.createdOn < a.createdOn) ? -1 : 0;
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

    let toPrint;
    let first = 1;
    
    if(searchResults.length !== 0) {
        toPrint = (searchResults.sort((a,b) => optionSorter(a,b)).map((result) => {
            let permissions = [];
            
            result.permissions.map(perms => {
                permissions.push(perms.emailAddress + ", " + perms.role);
                permissions.push(<br></br>)
            })
            if(permissions.length === 0){
                permissions.push("Information not provided");
                permissions.push(<br></br>)
            }
            
            let createdAt = "";
            if(result.createdOn !== undefined){
                createdAt = "" + result.createdOn;
                let year = createdAt.substring(0, 4);
                let month = createdAt.substring(5, 7);
                let day = createdAt.substring(8, 10);
                createdAt = month + "/" + day + "/" + year;
            } else{
                createdAt = "Information not provided";
            }

            let owner = result.owner !== undefined ? result.owner : "Owner not found";
            // console.log(permissions);

            return (
                <table>
                    <tr>
                        <th>{first === 1 ? "Name" : null}</th>
                        <th>{first === 1 ? "Owner" : null}</th>
                        {first = null}
                    </tr>
                    <tr>
                        <th className="user-menu-item" key={result.id}> 
                        <div className="search-result-file-name">{result.name} </div>
                        </th>
                        <th>
                            <div>{owner} </div>
                        </th>
                        <div className="file-info-block">
                            <div className="file-info-name" onClick={() => setPermsAndToggle(permissions, createdAt)}>
                                <div>MetaData</div>
                                {openDropdown ?
                                    <IoIosArrowUp size={20}/>
                                    :
                                    <IoIosArrowDown size={20}/>
                                }
                            
                            </div>
                            
                        </div>
                    </tr>
                </table>
                
            )
            
        }))
    }
    else{
        toPrint =
            <li className="user-menu-item"  key={null}>
                <span>{"No Result"}</span>
            </li>
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
                {toPrint}
            </div>
            
        </div>
        {
            showModal &&
                <MetaData 
                    permissions = {permissions}
                    createdOn = {createdOn}
                    toggleModal={handleToggleModal}
                />
        }
        </>
    )
}