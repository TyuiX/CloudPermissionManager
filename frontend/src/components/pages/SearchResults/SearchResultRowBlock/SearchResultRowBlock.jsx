import React, {useContext, useState} from 'react';
import "./SearchResultRowBlock.css";
import SearchResultRowPermsTable from "../SearchResultRowPermsTable/SearchResultRowPermsTable";
import {AiOutlineExclamationCircle} from "react-icons/ai";
import {UserContext} from "../../../../utils/context/UserContext";

export default function SearchResultRowBlock(props) {
    const {file, addToSelected, snapId} = props
    const {name, owner, lastUpdatedOn, createdOn, permissions, id, ownedByMe} = file
    const [openDropdown, setOpenDropdown] = useState(false);
    const {snapshots} = useContext(UserContext);

    return (
        <>
            <div className="result-table-row">
                <div className="result-table-cell result-select-button">
                    {
                        // check if user has ownership to update file and search was from most recent snapshot
                        ownedByMe && snapshots[0]._id === snapId &&
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
                    onClick={() => setOpenDropdown(!openDropdown)}
                >
                    {openDropdown ? "-" : "+"}
                </div>
            </div>
            {openDropdown &&
                <div className="result-row-more-info-container">
                    <div className="result-perm-note">
                        <AiOutlineExclamationCircle size={20} />
                        <div>
                            Note: some permissions listed only as inherited might also be directly assigned.
                        </div>
                    </div>
                    <div className="result-perm-table-label">Users</div>
                    <SearchResultRowPermsTable permissions={permissions} permType={"user"} snapId={snapId} file={file}/>
                    <div className="result-perm-table-label">Groups</div>
                    <SearchResultRowPermsTable permissions={permissions} permType={"group"} snapId={snapId} file={file}/>
                    <div className="result-perm-table-label">Domains</div>
                    <SearchResultRowPermsTable permissions={permissions} permType={"domain"} snapId={snapId} file={file}/>
                    <div className="result-perm-table-label">Anyone with Link</div>
                    <SearchResultRowPermsTable permissions={permissions} permType={"anyone"} snapId={snapId} file={file}/>
                </div>
            }
        </>
    )
}