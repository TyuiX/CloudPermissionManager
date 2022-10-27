import React, {useContext} from 'react';
import PageSideBar from '../../common-page-components/PageSidebar/PageSideBar';
import {UserContext} from "../../../utils/context/UserContext";


export default function SearchResults() {
    const {searchResults} = useContext(UserContext)
    console.log(searchResults)

    let toPrint;
    if(searchResults.length !== 0) {
        toPrint = (searchResults.map((result) => {
            console.log(result);
            return (
                <li className="user-menu-item"  key={result.id}>
                    <span>{result.name} </span>
                </li>
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