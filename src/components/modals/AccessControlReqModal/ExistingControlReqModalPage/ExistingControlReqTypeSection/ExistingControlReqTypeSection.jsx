import React from 'react';
import "./ExistingControlReqTypeSection.css";

export default function ExistingControlReqTypeSection(props) {
    const {users, label} = props;
    const {emails, domains} = users;

    return (
        <div className="control-req-section-container">
            <div className="control-req-section-header">
                {label}
            </div>
            <div className="control-req-domain-container">
                <div className="control-req-domain-header">Emails:</div>
                <div className="existing-access-req-user-tag-list">
                    {emails.map((email, index) => (
                        <div key={index} className="existing-access-req-user-tag">{email}</div>
                    ))}
                </div>
            </div>
            <div className="control-req-domain-container">
                <div className="control-req-domain-header">Domains:</div>
                <div className="existing-access-req-user-tag-list">
                    {domains.map((domain, index) => (
                        <div key={index} className="existing-access-req-user-tag">{domain}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}