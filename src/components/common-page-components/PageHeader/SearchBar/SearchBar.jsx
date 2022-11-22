import React, {useContext, useEffect, useState} from 'react';
import {GoDeviceCamera} from 'react-icons/go';
import {AiOutlineSearch} from 'react-icons/ai';
import {UserContext} from "../../../../utils/context/UserContext";
import {GoogleContext} from "../../../../utils/context/GoogleContext"
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
    const {sharedDrives} = useContext(GoogleContext);
    const [currentSnap, setCurrentSnap] = useState(snapshots.length !== 0 ? snapshots[0] : {});
    const navigate = useNavigate();
    const {setSearchText, searchText} = props;

    // let sharedDrives = "";
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
                await searchByName(currentSnap._id, searchText);
                getRecentSearches();
                navigate('/searchresults');
            }
        }
    }

    const handleForQuery = async() => {
        if(snapshots && !isLoading && snapshots.length !== 0){
            let queryOptions = searchText.split(" ");
            console.log(sharedDrives);
            await performSearch(currentSnap, queryOptions, true, sharedDrives);
            getRecentSearches();
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
                        value={searchText}
                        onChange={({ target }) => setSearchText(target.value)}
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