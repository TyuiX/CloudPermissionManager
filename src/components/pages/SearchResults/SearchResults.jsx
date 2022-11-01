import React, {useContext, useState} from 'react';
import PageSideBar from '../../common-page-components/PageSidebar/PageSideBar';
import {UserContext} from "../../../utils/context/UserContext";
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import "./SearchResults.css"
import MetaData from './MetaData';
import { RiContrastDropLine } from 'react-icons/ri';

export default function SearchResults() {
    const {searchResults} = useContext(UserContext);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const [createdOn, setCreatedOn] = useState([]);

    const handleToggleModal = () => {
        setShowModal(!showModal);
    }

    const setPermsAndToggle = (permissions, createdAt) => {
        setPermissions(permissions);
        setCreatedOn(createdAt);
        handleToggleModal();
    }

    let toPrint;
    let first = 1;
    
    if(searchResults.length !== 0) {
        toPrint = (searchResults.map((result) => { // 
            console.log(result);
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
            console.log(permissions);

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