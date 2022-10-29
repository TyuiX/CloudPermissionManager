import React, {useContext, useEffect, useState} from 'react';
import {GoDeviceCamera} from 'react-icons/go';
import {AiOutlineSearch} from 'react-icons/ai';
import {UserContext} from "../../../../utils/context/UserContext";
import "./SearchBar.css";
import {useNavigate} from "react-router-dom";
import QueryBuilder from "./QueryBuilder/QueryBuilder";
import TextQueryBuilder from "./TextQueryBuilder/TextQueryBuilder";
import {FaFilter} from "react-icons/fa";

export default function SearchBar(props) {
    const [showSnapshots, setShowSnapshots] = useState(false);
    const [showQueryBuilder, setShowQueryBuilder] = useState(false);
    const [showSelection, setShowSelection] = useState(false);
    const [textSearch, setTextSearch] = useState(false);
    const {isLoading, snapshots, searchByName, getRecentSearches, performSearch} = useContext(UserContext);
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
        if(textSearch === 0){
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
            // await searchByName(currentSnap._id, fileName);
            // getRecentSearches();
            // navigate('/searchresults');
            console.log("right place");
            console.log(fileName);
            let queryOptions = fileName.split(" ");

            console.log(queryOptions);
            let existingQueriesMap = new Map();
            
            let index = 0;
            while(index < queryOptions.length){
                let nameOfFile = queryOptions[index];
                let queryOption = queryOptions[index];
                queryOption = queryOptions[index].substring(0, queryOptions[index].indexOf(":"));
                console.log(queryOption);
                console.log(nameOfFile);
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
                }
                index += 1;
                console.log(existingQueriesMap);
            }
            

    
            console.log(existingQueriesMap);
            performSearch(currentSnap, existingQueriesMap, true);
            navigate('/searchresults');
        }
    }

    const handleEnterPress = (e) => {
        if(e.key === "Enter" && textSearch === 1) {
            e.preventDefault()
            handleSearch()
        }
        else if(e.key === "Enter" && textSearch === 0){
            e.preventDefault();
            handleForQuery();
        }
    }

    const toggleQueryBuilderDisplay = () => {
        setShowQueryBuilder(!showQueryBuilder);
    }

    const toggleSearchOrQueryDisplay = () => {
        setShowSelection(!showSelection);
    }

    console.log(textSearch);
    return (
        <div className="header-center-content-container">
            <FaFilter onClick={toggleSearchOrQueryDisplay} size={20} className="search-filter-button" />
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
            <div className={`search-dropdown ${showSelection ? "search-dropdown-open" : ""}`}>
                <TextQueryBuilder currentSnap={currentSnap} toggleDropdown={toggleSearchOrQueryDisplay}
                setTextSearch={setTextSearch}/>
            </div>
        </div>
    );
}