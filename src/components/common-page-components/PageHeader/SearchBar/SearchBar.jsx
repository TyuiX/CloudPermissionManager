import React, {useContext, useEffect, useRef, useState} from 'react';
import {GoDeviceCamera} from 'react-icons/go';
import {AiOutlineSearch} from 'react-icons/ai';
import {UserContext} from "../../../../utils/context/UserContext";
import "./SearchBar.css";


export default function SearchBar(props) {
    const [dropdown, setDropdown] = useState(false);
    const {isLoading, snapshots, searchByName} = useContext(UserContext);
    const [currentSnap, setCurrentSnap] = useState(snapshots.length !== 0?snapshots[0]:[]);
    const wrapperRef = useRef(null);
    const [result, setResult] = useState("");

    useEffect(() => {
        // console.log("in search");
        if (!props.snapshots) {
            // console.log("no snap");
            return
        }
        // console.log("filename is");
        // console.log(props.fileName);
        // console.log(snapshots);
        setCurrentSnap(snapshots.length !== 0?snapshots[0]:[]);
        // console.log(currentSnap);
        // setSearch(props.fileName);
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
        console.log("handle snap");
        setDropdown(false);
        setCurrentSnap(snap);
    }

    //use currentSnap and fileName to filter files and get result
    const handleSearch = async() => {
        console.log("in handle search");
        console.log(currentSnap._id);
        console.log(props.fileName);
        let output = await searchByName(currentSnap._id, props.fileName);
        setResult(output.length===0?"":output[0].name);
        console.log(output.length === 0? "no len":output[0].name);
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
                                            <li className="user-menu-item" onClick={() => handleSnapshotClick(snap)}>
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
            <input className="e-input" type="text" placeholder="Search Results Here" value={result?result:"No Results!"} readOnly={true}/>
            </div>
        </>
    );
}