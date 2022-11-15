import React from 'react';
import "./SearchResultRowPermsTable.css";

const SearchTableHeader = (hasEmail) => {

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
            <div className="result-perm-table-header-cell">Permission Source</div>
        </div>
    )
}

export default function SearchResultRowPermsTable(props) {
    const {permissions, permType} = props

    if (permType === "anyone") {
        return (
            <div className="result-perm-table">
                {SearchTableHeader(false)}
                {permissions.filter(({type}) => type === permType).length > 0 ?
                    permissions.filter(({type}) => type === permType).map((perm) => (
                        <div className="result-perm-table-row">
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
            {SearchTableHeader(true)}
            {permissions.filter(({type}) => type === permType).length > 0 ?
                permissions.filter(({type}) => type === permType).map((perm) => (
                    <div className="result-perm-table-row">
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

                ))
                :
                <div className="no-perm-info-avail-table-msg">
                    <div>No available information.</div>
                </div>
            }
        </div>
    );
}