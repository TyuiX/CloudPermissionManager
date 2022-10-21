import React, {useContext, useEffect, useRef, useState} from 'react';
import {GoDeviceCamera} from 'react-icons/go';
import {AiOutlineSearch} from 'react-icons/ai';
import {UserContext} from "../../../../utils/context/UserContext";
import "./SearchBar.css";
import {useNavigate} from "react-router-dom";


export default function SearchBar(props) {
    const [dropdown, setDropdown] = useState(false);
    const {isLoading, snapshots, searchByName, getRecentSearches} = useContext(UserContext);
    const [currentSnap, setCurrentSnap] = useState(snapshots.length !== 0?snapshots[0]:[]);
    const wrapperRef = useRef(null);
    const [result, setResult] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!snapshots) {
            return
        }
        setCurrentSnap(snapshots.length !== 0?snapshots[0]:[]);
        document.addEventListener("click", handleClickOutside, false);
        return () => {
            document.removeEventListener("click", handleClickOutside, false);
        };
    }, []);

    const handleClickOutside = event => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setDropdown(false);
        }
    }

    const handleSnapshotClick = (snap) => {
        setDropdown(false);
        setCurrentSnap(snap);
    }

    const handleSearch = async() => {
        let output;
        if(snapshots && !isLoading && snapshots.length !== 0){
            //fixes issue of search not working after first snap
            if(snapshots.length === 1){
                output = await searchByName(snapshots[0]._id, props.fileName);
            }
            else{
                output = await searchByName(currentSnap._id, props.fileName);
            }
            setResult(output.length===0?"":output[0].name);
            getRecentSearches();
            navigate('/searchresults', {state: {results:output}});
        }
    }

    return (
        <>
            <div className={"search-bar-container"}>
                <input
                    type="text"
                    value={props.fileName}
                    onChange={({ target }) => props.setFileName(target.value)}
                    placeholder="Search..."
                />
            </div>
            <div className="profile-dropdown-container"
            ref={wrapperRef}>
            <GoDeviceCamera
                className="snapshot-button"
                size={30}
                onClick={() => setDropdown(!dropdown)}
            />
                <ul className={`user-dropdown ${dropdown ? "user-dropdown-open" : ""}`}>
                    {(snapshots && !isLoading && snapshots.length !== 0) &&
                                    (snapshots.map((snap) => {
                                        return (
                                            <li className="user-menu-item" key={snap._id} onClick={() => handleSnapshotClick(snap)}>
                                                <span value={snap} >id: {snap._id}  date: {snap.date}</span>
                                            </li>
                                        )
                                    }))
                                }                
                    {(!snapshots || isLoading || snapshots.length === 0) &&
                        <li className="no-snapshots-message">No snapshots!</li>
                    }
                </ul>
            </div>
            <div className='search'>
                    <AiOutlineSearch size={30} className="search-button" onClick={handleSearch}/>
            </div> 
            <div>
            {/* <input className="e-input" type="text" placeholder="Search Results Here" value={result?result:"No Results!"} readOnly={true}/> */}
            </div>
        </>
    );
}