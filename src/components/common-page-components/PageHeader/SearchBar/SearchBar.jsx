import React, {useContext, useEffect, useState} from 'react';
import {GoDeviceCamera} from 'react-icons/go';
import {AiOutlineSearch} from 'react-icons/ai';
import {UserContext} from "../../../../utils/context/UserContext";
import "./SearchBar.css";
import {useNavigate} from "react-router-dom";
import QueryBuilder from "./QueryBuilder/QueryBuilder";
import {FaFilter} from "react-icons/fa";
import { ToggleSlider }  from "react-toggle-slider";

export default function SearchBar(props) {
    const [showSnapshots, setShowSnapshots] = useState(false);
    const [showQueryBuilder, setShowQueryBuilder] = useState(false);
    const [textSearch, setTextSearch] = useState(true);
    const {isLoading, snapshots, searchByName, getRecentSearches, performSearch} = useContext(UserContext);
    const [currentSnap, setCurrentSnap] = useState(snapshots.length !== 0 ? snapshots[0] : {});
    const navigate = useNavigate();
    const {setFileName, fileName} = props;

    useEffect(() => {
        if (!snapshots) {
            return
        }
        setCurrentSnap(snapshots.length !== 0 ? snapshots[0] : {});
    }, [snapshots]);

    const handleSnapshotClick = (e) => {
        e.preventDefault()
        let found = snapshots.find(({_id}) => _id ===  e.target.value)
        if (found) {
            setCurrentSnap(found);
        }
    }

    const handleSearch = async() => {
        if(textSearch === false){
            handleForQuery();
        }
        else{
            if(snapshots && !isLoading && snapshots.length !== 0){
                await searchByName(currentSnap._id, fileName);
                getRecentSearches();
                navigate('/searchresults');
            }
        }
    }

    const handleForQuery = async() => {
        if(snapshots && !isLoading && snapshots.length !== 0){
            let queryOptions = fileName.split(" ");
            let existingQueriesMap = new Map();
            let index = 0;

            while(index < queryOptions.length){
                let nameOfFile = queryOptions[index];
                let queryOption = queryOptions[index];
                let ifSharing = "";
                // console.log(queryOptions)
                // console.log(queryOptions[index].substring(0, queryOptions[index].indexOf(":")));
                if(queryOptions[index].substring(0, queryOptions[index].indexOf(":")) === "sharing"){
                    ifSharing = queryOptions[index].substring(queryOptions[index].indexOf(":") + 1, queryOptions[index].lastIndexOf(":"));
                    // console.log(ifSharing);
                }
                // console.log(queryOption);
                queryOption = queryOptions[index].substring(0, queryOptions[index].indexOf(":"));
                if(queryOption === "owner" || queryOption === "creator" ||
                queryOption === "from" || queryOption === "to" || queryOption === "readable" ||
                    queryOption === "writeable" || queryOption === "shareable"){
                        existingQueriesMap.set(queryOption + ":user", nameOfFile.substring(nameOfFile.indexOf(":") + 1));
                } else if(queryOption === "drive"){
                    existingQueriesMap.set(queryOption + ":drive", nameOfFile.substring(nameOfFile.indexOf(":") + 1));
                } else if(queryOption === "name" || queryOption === "inFolder" || queryOption === "folder"){
                    existingQueriesMap.set(queryOption + ":regexp", nameOfFile.substring(nameOfFile.indexOf(":") + 1));
                } else if(queryOption === "path"){
                    existingQueriesMap.set(queryOption + ":path", nameOfFile.substring(nameOfFile.indexOf(":") + 1));
                } else if(ifSharing.length !== 0) {
                    // console.log("in here");
                    // console.log(ifSharing);
                    // console.log(queryOptions[index].substring(queryOptions[index].indexOf(":")+1))
                    // console.log(nameOfFile.substring(nameOfFile.lastIndexOf(":") + 1));
                    if(queryOptions[index].substring(queryOptions[index].indexOf(":")+1) === "none"){
                        existingQueriesMap.set(queryOptions[index], 
                            nameOfFile.substring(nameOfFile.lastIndexOf(":") + 1));
                    } else if(ifSharing === "individual"){
                        existingQueriesMap.set(queryOptions[index].substring(0, queryOptions[index].lastIndexOf(":")), 
                            nameOfFile.substring(nameOfFile.lastIndexOf(":") + 1));
                    }
                } // else{
                //     console.log(queryOption);
                //     console.log(nameOfFile);
                //     existingQueriesMap.set(nameOfFile, nameOfFile.substring(nameOfFile.indexOf(":") + 1));
                // }
                index += 1;
            }
            
            performSearch(currentSnap, existingQueriesMap, true);
            navigate('/searchresults');
        }
    }

    const handleEnterPress = (e) => {
        if(e.key === "Enter" && textSearch === true) {
            e.preventDefault()
            handleSearch()
        }
        else if(e.key === "Enter" && textSearch === false){
            e.preventDefault();
            handleForQuery();
        }
    }

    const toggleQueryBuilderDisplay = () => {
        setShowQueryBuilder(!showQueryBuilder);
    }

    const setQueryOrSearch = () => {
        setTextSearch(!textSearch);
    }

    let textOrQuery = textSearch ? "Text Search" : "Query Search";

    return (
        <div className="header-center-content-container">
            <div className="query-toggle-label"> {textOrQuery} </div>
            <div className="query-toggle-container">
                <ToggleSlider
                    onToggle={setQueryOrSearch}
                    handleSize={14}
                    barHeight={22}
                    barWidth={40}
                    barBackgroundColorActive={"#6495EDFF"}
                />
            </div>
            <div className="search-bar-container">
                <form onKeyDown={(e) => handleEnterPress(e)} className="modal-form">
                    <input
                        className="header-search-bar"
                        type="text"
                        value={fileName}
                        onChange={({ target }) => setFileName(target.value)}
                        placeholder="Search..."
                    />
                </form>
                <AiOutlineSearch size={30} className="search-button" onClick={handleSearch}/>
                <FaFilter onClick={toggleQueryBuilderDisplay} size={20} className="search-filter-button" />
            </div>
            <div className="snapshot-selection-container">
                <GoDeviceCamera
                    className="snapshot-icon"
                    size={30}
                    onClick={() => setShowSnapshots(!showSnapshots)}
                />
                <select onChange={(e) => handleSnapshotClick(e)}>
                    {snapshots.length > 0 && snapshots.map(({_id}) => (
                        <option key={_id} value={_id}>{_id}</option>
                    ))}
                </select>
            </div>
            <div className={`search-dropdown ${showQueryBuilder ? "search-dropdown-open" : ""}`}>
                <QueryBuilder
                    currentSnap={currentSnap}
                    toggleDropdown={toggleQueryBuilderDisplay}
                    dropdownOpen={showQueryBuilder}
                />
            </div>
        </div>
    );
}