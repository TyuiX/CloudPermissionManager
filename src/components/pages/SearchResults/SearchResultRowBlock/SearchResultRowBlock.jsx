import React from 'react';
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";

export default function SearchResultRowBlock(props) {
    const {file, addToSelected} = props
    const {name, owner, lastUpdatedOn, createdOn, permissions, id, ownedByMe} = file

    return (
        <div className="result-table-row">
            <div className="result-table-cell result-select-button">
                {
                    ownedByMe &&
                    <input
                        type="checkbox"
                        id="checkGroup"
                        name="checkGroup"
                        onChange={(e) => addToSelected(e, id)}
                    />
                }
            </div>
            <div className="result-table-cell">{name}</div>
            <div className="result-table-cell">{owner}</div>
            <div className="result-table-cell">{new Date(lastUpdatedOn).toLocaleString()}</div>
            <div className="result-table-cell">{new Date(createdOn).toLocaleString()}</div>
            <div
                className="result-table-cell more-detail-button"
            >
                +
            </div>
        </div>
    )
}