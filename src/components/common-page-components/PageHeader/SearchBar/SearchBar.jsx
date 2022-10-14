import React, {useContext, useEffect, useRef, useState} from 'react';
import {GoDeviceCamera} from 'react-icons/go';
import {AiOutlineSearch} from 'react-icons/ai';
// import {SnapshotContext} from "../../../../utils/context/SnapshotContext";
import {UserContext} from "../../../../utils/context/UserContext";
import "./SearchBar.css";


export default function SearchBar(props) {
    const [dropdown, setDropdown] = useState(false);
    const [currentSnap, setCurrentSnap] = useState(props.snapshots.data !== undefined?props.snapshots.data[0]:[]);
    // const {snapshots} = useContext(SnapshotContext);
    const {isLoading} = useContext(UserContext)
    const wrapperRef = useRef(null);
    const [result, setResult] = useState([]);
    // console.log("ins earch");
    // console.log(props.snapshots);
    // console.log(isLoading);

    useEffect(() => {
        // console.log("in search");
        if (!props.snapshots) {
            // console.log("no snap");
            return
        }
        // console.log("filename is");
        // console.log(props.fileName);
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
        setCurrentSnap(snap);
        setDropdown(false);
    }

    //use currentSnap and fileName to filter files and get result
    const handleSearch = () => {
        // console.log("in handle search");
        // console.log(currentSnap.folders);
        // let snapshot = currentSnap;
        // let folderkey = [...snapshot.folders.keys()]
        // for (let i of folderkey){
        //     snapshot.folders.set(i , new Map(Object.entries(snapshot.folders.get(i))))
        //     let fileskey = snapshot.folders.get(i).keys()
        //     for(let  j of fileskey){
        //         snapshot.folders.get(i).get(j).perm = new Map(Object.entries(snapshot.folders.get(i).get(j).perm))
        //     }
        // }
        // let output = []
        // for (let folder of folderkey){
        //     let files = snapshot.folders.get(folder).keys()
        //     for (let file of files){
        //         if (snapshot.folder.get(folder).get(file).name.includes(props.fileName)){
        //             output.push(snapshot.folder.get(folder).get(file))
        //         }
        //     }
        // }
        // setResult(output);
        // console.log("in handle search");
        // console.log(output);
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
                    {(props.snapshots && !isLoading && props.snapshots.data !== undefined) &&
                                    (props.snapshots.data.map((snap) => {
                                        return (
                                            <li className="user-menu-item">
                                                <span value={snap} onClick={() => handleSnapshotClick(snap)}>id: {snap._id}  date: {snap.date}</span>
                                            </li>
                                        )
                                    }))
                                }                
                    {(!props.snapshots && isLoading && props.snapshots.data === undefined) &&
                        <li className="no-snapshots-message">No snapshots!</li>
                    }
                </ul>
            </div>
            <div className='search'>
                    <AiOutlineSearch size={30} className="search-button" onClick={handleSearch}/>
            </div> 
        </>
    );
}