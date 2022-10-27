import React, {useContext, useEffect, useState} from 'react';
import {GoDeviceCamera} from 'react-icons/go';
import {AiOutlineSearch} from 'react-icons/ai';
import {UserContext} from "../../../../utils/context/UserContext";
import "./SearchBar.css";
import {useNavigate} from "react-router-dom";
import QueryBuilder from "../../../pages/QueryBuilder/QueryBuilder";
import {FaFilter} from "react-icons/fa";

export default function SearchBar(props) {
    const [showSnapshots, setShowSnapshots] = useState(false);
    const [showQueryBuilder, setShowQueryBuilder] = useState(false);
    const {isLoading, snapshots, searchByName, getRecentSearches} = useContext(UserContext);
    const [currentSnap, setCurrentSnap] = useState(snapshots.length !== 0 ? snapshots[0] : {});
    const [result, setResult] = useState("");
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
        console.log(e.target.value)
        let found = snapshots.find(({_id}) => _id ===  e.target.value)
        if (found) {
            setCurrentSnap(found);
        }
    }

    const handleSearch = async() => {
        if(snapshots && !isLoading && snapshots.length !== 0){
            await searchByName(currentSnap._id, fileName);
            getRecentSearches();
            navigate('/searchresults');
        }
    }

    const handleEnterPress = (e) => {
        if(e.key === "Enter") {
            e.preventDefault()
            handleSearch()
        }
    }

    const toggleQueryBuilderDisplay = () => {
        setShowQueryBuilder(!showQueryBuilder);
    }

    return (
        <div className="header-center-content-container">
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
                <QueryBuilder currentSnap={currentSnap} toggleDropdown={toggleQueryBuilderDisplay} />
            </div>
        </div>
    );
}