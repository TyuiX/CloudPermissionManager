import React, {useContext, useState} from 'react';
import PageSideBar from '../../common-page-components/PageSidebar/PageSideBar';
import {UserContext} from "../../../utils/context/UserContext";
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import "./SearchResults.css"

export default function SearchResults() {
    const {searchResults} = useContext(UserContext);
    const [openDropdown, setOpenDropdown] = useState(true);
    console.log(searchResults)

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
                        <span>{result.name} </span>
                        </th>
                        <th>
                            <span>{result.owner} </span>
                        </th>
                        <div className="file-info-block">
                            <div className="file-info-name" onClick={() => setOpenDropdown(!openDropdown)}>
                                <span>MetaData</span>
                                {openDropdown ?
                                    <IoIosArrowUp size={20}/>
                                    :
                                    <IoIosArrowDown size={20}/>
                                }
                                {
                                    openDropdown &&
                                    <>
                                    <br></br>
                                    <div className="update-access-button-container">
                                        Permissons: {permissions}
                                    </div>
                                    </>
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
        <div className="page-container">
            <PageSideBar />
            <div className="page-content">
                {toPrint}
            </div>
            
        </div>
    )
}