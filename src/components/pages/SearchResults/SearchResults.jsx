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

    const handleToggleModal = () => {
        setShowModal(!showModal);
    }

    const setPermsAndToggle = (permissions) => {
        setPermissions(permissions);
        handleToggleModal();
    }

    let toPrint;
    let first = 1;
    
    if(searchResults.length !== 0) {
        toPrint = (searchResults.map((result) => { // 
            
            let permissions = [];
            result.permissions.map(perms => {
                // console.log("perms: ");
                permissions.push(perms.emailAddress + ", " + perms.role);
                permissions.push(<br></br>)
            })
            if(permissions.length === 0){
                permissions.push("Information not provided");
                permissions.push(<br></br>)
            }
            

            // console.log(result.owner);
            let owner = result.owner !== undefined ? result.owner : "Owner not found";
            // console.log(result);
            // console.log("here");
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
                            <div className="file-info-name" onClick={() => setPermsAndToggle(permissions)}>
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
                    toggleModal={handleToggleModal}
                />
        }
        </>
    )
}