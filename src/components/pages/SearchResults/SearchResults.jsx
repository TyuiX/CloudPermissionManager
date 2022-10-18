import React, {useContext, useEffect, useRef, useState} from 'react';
import {GoDeviceCamera} from 'react-icons/go';
import {AiOutlineSearch} from 'react-icons/ai';
import { Route, Routes, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PageSideBar from '../../common-page-components/PageSidebar/PageSideBar';


export default function SearchResults(props) {

    const {state} = useLocation();
    const{results} = state;

    let toPrint = null;
    if(results && results.length !== 0) {
        toPrint = (results.map((result) => {
            return (
                <li className="user-menu-item"  key={result.id}>
                    <span>{result.name}</span>
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