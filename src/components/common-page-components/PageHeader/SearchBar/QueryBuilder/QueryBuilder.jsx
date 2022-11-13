import React, {useNavigate} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import "./QueryBuilder.css";
import {UserContext} from "../../../../../utils/context/UserContext";
import ControlReqQueriesLists from "../../../../../utils/ControlReqQueriesLists";
import {MdOutlineDescription} from "react-icons/md";
import QueryBuilderQueryTag from "./QueryBuilderQueryTag/QueryBuilderQueryTag";

export default function QueryBuilder(props) {
    const {currentSnap, toggleDropdown, dropdownOpen} = props;
    const {performSearch, getRecentSearches} = useContext(UserContext);
    const [selectedQueryOp, setSelectedQueryOp] = useState("drive:drive");
    const [selectedQueryArg, setSelectedQueryArg] = useState("");
    const [existingQueries, setExistingQueries] = useState([]);
    const [stringQuery, setStringQuery] = useState("");
    const navigate = useNavigate();

    // refresh values when dropdown is closed and opened
    useEffect(() => {
        if (!dropdownOpen) {
            setSelectedQueryOp("drive:drive")
            setSelectedQueryArg("")
            setStringQuery("")
            setExistingQueries([])
        }
    },[dropdownOpen])

    // construct query string to display
    useEffect(() => {
        if (existingQueries.length < 1) {
            setStringQuery("")
            return
        }
        let queryStringBuilder = ""
        existingQueries.forEach(({display}) => {
            queryStringBuilder += display + " and "
        })
        queryStringBuilder = queryStringBuilder.slice(0, -5);
        setStringQuery(queryStringBuilder)
    },[existingQueries])

    const handleSelectOperator = (e) => {
        e.preventDefault()
        let queryOp = e.target.value
        // check if a "sharing:..." operation was selected
        if (queryOp.startsWith("sharing:")) {
            let queryCopy = JSON.parse(JSON.stringify(existingQueries))
            queryCopy.push({
                opt: queryOp,
                arg: queryOp,
                display: queryOp
            })
            setExistingQueries(queryCopy);
            setSelectedQueryOp("drive:drive")
            setSelectedQueryArg("")
        } else {
            setSelectedQueryOp(queryOp);
        }
    }

    // perform actual search will full query
    const confirmQuery = async () => {
        console.log(existingQueries);
        await performSearch(currentSnap, stringQuery.split(" "), true, []);
        getRecentSearches();
        toggleDropdown()
        navigate('/searchresults');
    }

    // handle when user presses enter in text input
    const handleEnterPress = (e) => {
        if(e.key === "Enter") {
            confirmUpdate(e)
        }
    }

    // add query with operator and operand to list of queries
    const confirmUpdate = (e) => {
        e.preventDefault();
        let queryCopy = JSON.parse(JSON.stringify(existingQueries))
        queryCopy.push({
            opt: selectedQueryOp,
            arg: selectedQueryArg,
            display: selectedQueryOp.substring(0, selectedQueryOp.indexOf(':') + 1) + selectedQueryArg
        })
        console.log(queryCopy);
        setExistingQueries(queryCopy);
        setSelectedQueryOp("drive:drive")
        setSelectedQueryArg("")
    }

    // find query and remove from list
    const handleRemoveOperation = (queryToRemove) => {
        // create copy of existing queries
        let existingQueryCopy = JSON.parse(JSON.stringify(existingQueries))
        let queryIndex = existingQueryCopy.findIndex(({display}) => display === queryToRemove);
        existingQueryCopy.splice(queryIndex, 1);
        setExistingQueries(existingQueryCopy);
    }

    return (
        <>
            <div className="query-builder-container">
                <div className="query-string-label">Query String:</div>
                <div className="query-string">
                    {stringQuery ?
                        stringQuery
                        :
                        "Query Placeholder..."
                    }
                </div>
                <div className="query-tags-list">
                    {existingQueries.map(({display}) => (
                        <QueryBuilderQueryTag label={display} removeTag={handleRemoveOperation} />
                    ))}
                </div>
                <div className="query-operator-desc">
                    <MdOutlineDescription size={15} />...
                    {Object.values(ControlReqQueriesLists.QUERY_DESCRIPTIONS).find(({opt}) => opt === selectedQueryOp).desc}
                </div>
                <div className="query-builder-operations-container">
                    <select className="query-builder-select" onChange={(e) => handleSelectOperator(e)} value={selectedQueryOp}>
                        {Object.values(ControlReqQueriesLists.QUERY_DESCRIPTIONS).map(({opt}) => (
                            <option>
                                {opt}
                            </option>
                        ))}
                    </select>
                    <form onKeyDown={(e) => handleEnterPress(e, "email")} className="query-builder-form">
                        <input
                            className="query-builder-form-input"
                            type="text"
                            value={selectedQueryArg}
                            placeholder="Query Argument..."
                            onChange={({ target }) => setSelectedQueryArg(target.value.replace(/\s/g, ''))}
                        />
                        <button className="query-builder-add-button" onClick={(e) => confirmUpdate(e)}>Add</button>
                    </form>
                </div>
            </div>
            <div className="query-builder-footer">
                <button onClick={confirmQuery} className="execute-query-button">Search</button>
            </div>
        </>
    )
}