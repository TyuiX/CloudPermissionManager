import React from 'react';
import "./SearchResultRowPermsTable.css";
import SearchResultRowPermsGroupTable from "../SearchResultRowPermsGroupTable/SearchResultRowPermsGroupTable";

// generates static headers for each table
const SearchTableHeader = (hasEmail, group) => {
    if (!hasEmail) {
        return(
            <div className="result-perm-table-header">
                <div className="result-perm-table-header-cell anyone-link-perm-cell">Name</div>
                <div className="result-perm-table-header-cell anyone-link-perm-cell">Permission Type</div>
                <div className="result-perm-table-header-cell anyone-link-perm-cell">Permission Source</div>
            </div>
        )
    }

    return(
        <div className="result-perm-table-header">
            <div className="result-perm-table-header-cell">Name</div>
            <div className="result-perm-table-header-cell">Address/Domain</div>
            <div className="result-perm-table-header-cell">Permission Type</div>
            <div className="result-perm-table-header-cell ">Permission Source</div>
            {group &&
                <div className="result-perm-table-header-cell expand-group-mem-button"></div>
            }
        </div>
    )
}

export default function SearchResultRowPermsTable(props) {
    const {permissions, permType, snapId} = props

    if (permType === "anyone") {
        return (
            <div className="result-perm-table">
                {SearchTableHeader(false)}
                {permissions.filter(({type}) => type === permType).length > 0 ?
                    permissions.filter(({type}) => type === permType).map((perm) => (
                        <div key={perm.id} className="result-perm-table-row">
                            <div className="result-perm-table-cell anyone-link-perm-cell">
                                Anyone with Link
                            </div>
                            <div className="result-perm-table-cell anyone-link-perm-cell">
                                {perm.role}
                            </div>
                            <div className="result-perm-table-cell anyone-link-perm-cell">
                                inheritfunction
                            </div>
                        </div>
                    ))
                    :
                    <div className="no-perm-info-avail-table-msg">
                        <div>No available information.</div>
                    </div>

                }
            </div>
        )
    }

    return (
        <div className="result-perm-table">
            {SearchTableHeader(true, permType === "group")}
            {permissions.filter(({type}) => type === permType).length > 0 ?
                permissions.filter(({type}) => type === permType).map((perm) =>
                {
                    if (permType === "group") {
                        return (
                            <SearchResultRowPermsGroupTable key={perm.id} perm={perm} snapId={snapId} />
                        )
                    }
                    return(
                        <div key={perm.id} className="result-perm-table-row">
                            <div className="result-perm-table-cell">
                                {perm.displayName}
                            </div>
                            <div className="result-perm-table-cell">
                                {perm.type !== "domain" ? perm.emailAddress : perm.domain}
                            </div>
                            <div className="result-perm-table-cell">
                                {perm.role}
                            </div>
                            <div className="result-perm-table-cell">
                                inheritfunction
                            </div>
                        </div>
                    )
                })
                :
                <div className="no-perm-info-avail-table-msg">
                    <div>No available information.</div>
                </div>
            }
        </div>
    );
}