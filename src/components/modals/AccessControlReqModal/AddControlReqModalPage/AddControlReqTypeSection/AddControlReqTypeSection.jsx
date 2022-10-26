import React, {useEffect, useState} from 'react';
import "../../../index.css"
import AddedControlReqTag from "../AddedUsersControlTag/AddedControlReqTag";
import "./AddControlReqTypeSection.css";

export default function AddControlReqTypeSection(props) {
    const {title, updateList} = props;
    const [newEmail, setNewEmail] = useState("");
    const [newDomain, setNewDomain] = useState("");
    const [newEmails, setNewEmails] = useState([]);
    const [newDomains, setNewDomains] = useState([]);

    const handleEnterPress = (e, type) => {
        if(e.key === "Enter") {
            switch (type) {
                case "email":
                    handleSubmitEmail(e)
                    break;
                case "domain":
                    handleSubmitDomain(e)
                    break;
                default:
                    break;
            }
        }
    }

    useEffect(() => {
        updateList({
            emails: newEmails, 
            domains: newDomains,
            size: newEmails.length + newDomains.length
        });
    },[newEmails, newDomains, updateList])

    const handleSubmitEmail = (e) => {
        e.preventDefault();
        if (newEmail.trim().length !== 0) {
            let addedEmails = [...newEmails];
            if (!addedEmails.includes(newEmail)) {
                addedEmails.push(newEmail)
                setNewEmails(addedEmails);
            }
            setNewEmail("");
        }
    }

    const handleSubmitDomain = (e) => {
        e.preventDefault();
        if (newDomain.trim().length !== 0) {
            let addedDomains = [...newDomains];
            if (!addedDomains.includes(newDomain)) {
                addedDomains.push(newDomain)
                setNewDomains(addedDomains);
            }
            setNewDomain("");
        }
    }

    const handleRemoveEmail = (emailToRemove) => {
        let addedEmails = [...newEmails];
        let emailIndex = addedEmails.findIndex((email) => email === emailToRemove);
        addedEmails.splice(emailIndex, 1);
        setNewEmails(addedEmails);
    }

    const handleRemoveDomain = (domainToRemove) => {
        let addedDomains = [...newDomains];
        let domainIndex = addedDomains.findIndex((domain) => domain === domainToRemove);
        addedDomains.splice(domainIndex, 1);
        setNewDomains(addedDomains);
    }

    return (
        <div className="modal-section">
            <div className="modal-section-title">{title}</div>
            {newEmails.length > 0 &&
                <div className="added-item-tags-list">{newEmails.map((email, index) => (
                    <AddedControlReqTag key={"email-" + index} label={email} removeTag={handleRemoveEmail}/>
                ))}
                </div>
            }
            <form onKeyDown={(e) => handleEnterPress(e, "email")} className="modal-form">
                <input
                    className="modal-form-input"
                    type="text"
                    value={newEmail}
                    placeholder="Email: e.g. example@email.com"
                    onChange={({ target }) => setNewEmail(target.value)}
                />
                <button className="modal-add-text-button" onClick={(e) => handleSubmitEmail(e)}>Add</button>
            </form>
            {newDomains.length > 0 &&
                <div className="added-item-tags-list">{newDomains.map((domain, index) => (
                    <AddedControlReqTag key={"domain-" + index} label={domain} removeTag={handleRemoveDomain}/>
                ))}
                </div>
            }
            <form onKeyDown={(e) => handleEnterPress(e, "domain")} className="modal-form">
                <input
                    className="modal-form-input"
                    type="text"
                    value={newDomain}
                    placeholder="Domain: e.g. stonybrook.edu"
                    onChange={({ target }) => setNewDomain(target.value)}
                />
                <button className="modal-add-text-button" onClick={(e) => handleSubmitDomain(e)}>Add</button>
            </form>
        </div>
    );
}