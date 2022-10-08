import React, {useContext, useEffect, useState} from 'react';
import "../index.css";
import {AiOutlineClose} from "react-icons/ai";
import {GoogleContext} from "../../../utils/context/GoogleContext";

export default function UpdateSharingModal(props) {
    const {existingPerms, toggleModal, closeInfo, fileId, fileName, origin} = props;
    const [newUsers, setNewUsers] = useState([]);
    const [existingUsers, setExistingUsers] = useState([]);
    const [updatedUsers, setUpdatedUsers] = useState([]);
    const {updateFilePerms} = useContext(GoogleContext)

    console.log(existingUsers);
    console.log(updatedUsers);

    useEffect(() => {
        if (!existingPerms) {
            return;
        }
        let users = existingPerms.filter(({type, role}) => type === "user" && role !== "owner" ).map(({displayName, id, role, type, emailAddress}) => {
            return {
                name: displayName,
                id: id,
                email: emailAddress,
                origin: origin,
                role: role,
                type: type
            }
        })
        setExistingUsers(users);
    },[existingPerms, origin])

    const addPendingUpdate = (e, user) => {
        let pendingUsers = JSON.parse(JSON.stringify(updatedUsers));
        let userIndex = pendingUsers.findIndex(({id}) => id === user.id);

        if (userIndex === -1) {
            let existingUser = {...user};
            existingUser.role = e.target.value;
            pendingUsers.push(existingUser)
        }
        else {
            let currentUser = existingUsers.find(({id}) => id === user.id);
            pendingUsers[userIndex].role = e.target.value;
            if (pendingUsers[userIndex].role === currentUser.role) {
                pendingUsers.splice(userIndex, 1);
            }
        }
        setUpdatedUsers(pendingUsers);
    }

    const confirmUpdate = (e) => {
        e.preventDefault();
        updateFilePerms(fileId, updatedUsers, newUsers);
        toggleModal();
        closeInfo();
    }

    return (
        <div className="modal-background">
            <div className="modal-container">
                <div className="modal-header">
                    <span>{fileName}</span>
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
                <div className="modal-section">
                    <div className="modal-section-title">Existing Users:</div>
                    {existingUsers ?
                        existingUsers.map((user) => {
                            const {name, id, origin, role} = user;
                            return (
                                <div key={id}>
                                    <div>{name}</div>
                                    <select defaultValue={role} onChange={(e) => addPendingUpdate(e, user)}>
                                        <option value="writer">Allowed Writer</option>
                                        <option value="reader">Allowed Reader</option>
                                        <option value="unshared" >Unshared</option>
                                    </select>
                                </div>
                            )
                        })
                        :
                        <div>No existing users</div>
                    }
                </div>
                <div className="modal-section"></div>
                <div className="modal-section"></div>
                <div className="modal-footer">
                    <button onClick={(e) => confirmUpdate(e)}>Confirm</button>
                    <button>Cancel</button>
                </div>
            </div>
        </div>
    );
}