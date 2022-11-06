import React, {useContext, useEffect, useState} from 'react';
import "./UpdateSingleSharingModal.css";
import "../index.css";
import {AiOutlineClose} from "react-icons/ai";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import ErrorPopupModal from "../ErrorPopupModal/ErrorPopupModal";
import {UserContext} from "../../../utils/context/UserContext";
import ConfirmActionModal from "../ConfirmActionModal/ConfirmActionModal";

export default function UpdateSingleSharingModal(props) {
    const {existingPerms, toggleModal, closeInfo, fileId, fileName, origin} = props;
    const [newUsers, setNewUsers] = useState([]);
    const [existingUsers, setExistingUsers] = useState([]);
    const [updatedUsers, setUpdatedUsers] = useState([]);
    const [newEmail, setNewEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const {updateFilePerms} = useContext(GoogleContext);
    const {checkReqsBeforeUpdate, snapshots} = useContext(UserContext)
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    console.log(existingUsers)

    useEffect(() => {
        if (!existingPerms) {
            return;
        }
        let users = existingPerms.filter(({role}) => role !== "owner" )
            .map(({displayName, id, role, type, emailAddress}) => {
                if (type !== "anyone") {
                    return {
                        name: displayName,
                        id: id,
                        email: emailAddress,
                        origin: origin,
                        role: role,
                        type: type
                    }
                } else {
                    return {
                        name: "Anyone with Link",
                        id: id,
                        email: emailAddress,
                        origin: origin,
                        role: role,
                        type: type
                    }
                }
        })
        setExistingUsers(users);
    },[existingPerms, origin])

    const handleToggleModal = () => {
        setShowConfirmModal(!showConfirmModal)
    }

    const executeUpdate = () => {
        updateFilePerms(fileId, updatedUsers, newUsers, false);
        toggleModal();
        closeInfo();
    }

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

    const updateNewUser = (e, user) => {
        let addedUsers = JSON.parse(JSON.stringify(newUsers));
        let userIndex = addedUsers.findIndex(({email}) => email === user.email);
        addedUsers[userIndex].role = e.target.value;
        setNewUsers(addedUsers);
    }

    const addAnyoneLink = (e) => {
        e.preventDefault();
        let addedUsers = JSON.parse(JSON.stringify(newUsers));
        addedUsers.push({
            email: "Anyone with Link",
            origin: origin,
            role: "writer",
            type: "anyone"
        })
        setNewUsers(addedUsers)
    }

    const removeNewUser = (user) => {
        let addedUsers = JSON.parse(JSON.stringify(newUsers));
        let userIndex = addedUsers.findIndex(({email}) => email === user.email);
        addedUsers.splice(userIndex, 1);
        setNewUsers(addedUsers);
    }

    const confirmUpdate = async (e) => {
        e.preventDefault();
        if (updatedUsers.length === 0 && newUsers.length === 0) {
            setErrorMsg("No changes have been made!")
        } else {
            if (snapshots.length > 0) {
                let violates = await checkReqsBeforeUpdate([{
                    "fileId": fileId, "updatedUsers": updatedUsers, "newUsers": newUsers, "name": fileName
                }])
                if (violates) {
                    setShowConfirmModal(true)
                } else {
                    executeUpdate()
                }
            } else {
                executeUpdate()
            }
        }
    }

    const handleEnterPress = (e) => {
        if(e.key === "Enter") {
            handleSubmitEmail(e)
        }
    }

    const handleSubmitEmail = (e) => {
        e.preventDefault();
        if (newEmail.trim().length !== 0) {
            let addedUsers = JSON.parse(JSON.stringify(newUsers));
            if (existingUsers.find((user) => user.email === newEmail)) {
                setErrorMsg(newEmail + " already exists as a shared user of this file!")
            }
            else if (!addedUsers.find((user) => user.email === newEmail)) {
                addedUsers.push({
                    email: newEmail,
                    origin: origin,
                    role: "writer",
                    type: "user"
                })
                setNewUsers(addedUsers);
            }
            setNewEmail("");
        }
    }

    return (
        <>
            <div className="modal-background">
                <div className="modal-container sharing-modal-container">
                    <div className="modal-header">
                        <span>{fileName}</span>
                        <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                    </div>
                    <div className="modal-section">
                        <div className="modal-section-title">Existing Users:</div>
                        <div className="modal-users-list">
                            {existingUsers.length !== 0 ?
                                existingUsers.map((user) => {
                                    const {name, id, origin, role, email} = user;
                                    return (
                                        <div className="modal-user-item" key={id}>
                                            <div>
                                                <div className="modal-user-name">{name}</div>
                                                <div className="modal-user-email">{email}</div>
                                            </div>
                                            <select defaultValue={role} onChange={(e) => addPendingUpdate(e, user)}>
                                                <option value="writer">Writer</option>
                                                <option value="reader">Reader</option>
                                                <option value="commenter">Commenter</option>
                                                <option value="unshared" >Unshared</option>
                                                <option value="editor">Editor</option>
                                            </select>
                                        </div>
                                    )
                                })
                                :
                                <div className="no-users-message">No existing users...</div>
                            }
                        </div>
                    </div>
                    <div className="modal-section">
                        <div className="modal-section-title">New Users:</div>
                        <form onKeyDown={(e) => handleEnterPress(e)} className="modal-form">
                            <input
                                className="modal-form-input"
                                type="text"
                                value={newEmail}
                                placeholder="Email: e.g. example@email.com"
                                onChange={({ target }) => setNewEmail(target.value)}
                            />
                            <button className="modal-add-text-button" onClick={(e) => handleSubmitEmail(e)}>Add</button>
                        </form>
                        <div className="modal-users-list">
                            {newUsers.length !== 0 ?
                                newUsers.map((user) => {
                                    const {role, email} = user;
                                    return (
                                        <div className="modal-user-item" key={email}>
                                            <div className="modal-user-info">
                                                <AiOutlineClose className="modal-user-remove-icon" onClick={() => removeNewUser(user)} />
                                                <div className="modal-user-name">{email}</div>
                                            </div>
                                            <select defaultValue={role} onChange={(e) => updateNewUser(e, user)}>
                                                <option value="writer">Writer</option>
                                                <option value="reader">Reader</option>
                                                <option value="commenter">Commenter</option>
                                                <option value="editor">Editor</option>
                                            </select>
                                        </div>
                                    )
                                })
                                :
                                <div className="no-users-message">No new users...</div>
                            }
                        </div>
                    </div>
                    <div className="modal-footer">
                        {/*handles adding an "Anyone with Link" element to the file*/}
                        {!existingUsers.some(user => user.type === "anyone") && !newUsers.some(user => user.type === "anyone") &&
                            <button className="add-anyone-link" onClick={(e) => addAnyoneLink(e)}>Add Anyone with Link</button>
                        }
                        <button className="modal-button modal-confirm" onClick={(e) => confirmUpdate(e)}>Confirm</button>
                        <button className="modal-button modal-cancel" onClick={toggleModal}>Cancel</button>
                    </div>
                </div>
            </div>
            {errorMsg &&
                <ErrorPopupModal msg={errorMsg} updateText={setErrorMsg} />
            }
            {showConfirmModal &&
                <ConfirmActionModal
                msg={"These changes will result in Access Control Requirements being violated. Do you wish to proceed."}
                toggleModal={handleToggleModal}
                performOperation={executeUpdate}
                />
            }
        </>
    );
}