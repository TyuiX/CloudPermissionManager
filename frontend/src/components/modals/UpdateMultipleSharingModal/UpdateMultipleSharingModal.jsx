import React, {useContext, useEffect, useState} from 'react';
import "../index.css";
import "./UpdateMultipleSharingModal.css";
import {AiOutlineClose, AiOutlineExclamationCircle} from "react-icons/ai";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import ErrorPopupModal from "../ErrorPopupModal/ErrorPopupModal";
import {UserContext} from "../../../utils/context/UserContext";
import ConfirmActionModal from "../ConfirmActionModal/ConfirmActionModal";

export default function UpdateMultipleSharingModal(props) {
    const {files, toggleModal, closeInfo} = props;
    const [newUsers, setNewUsers] = useState([]);
    const [existingUsers, setExistingUsers] = useState([]);
    const [updatedUsers, setUpdatedUsers] = useState([]);
    const [newEmail, setNewEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const {updateMultipleFiles} = useContext(GoogleContext);
    const {checkReqsBeforeUpdate, snapshots} = useContext(UserContext)
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [storedFilesToUpdate, setStoredFilesToUpdate] = useState([])

    useEffect(() => {
        if (!files) {
            return;
        }
        let existingPerms = [];

        files.forEach((file) => {
            if (file.permissions) {
                file.permissions.filter(({role}) => role !== "owner" )
                    .forEach(({id, displayName, emailAddress, role, type}) => {
                        let index = existingPerms.findIndex((perm) => perm.id === id)
                        if (index !== -1) {
                            if (existingPerms[index].role !== role) {
                                existingPerms[index].role = "mixed"
                            }
                            existingPerms[index].inFiles.push({id: file.id, name: file.name, origin: file.cloudOrigin})
                        }
                        else {
                            if (type !== "anyone") {
                                existingPerms.push({
                                    name: displayName,
                                    id: id,
                                    email: emailAddress,
                                    role: role,
                                    type: type,
                                    inFiles: [{id: file.id, name: file.name, origin: file.cloudOrigin}]
                                })
                            } else {
                                existingPerms.push({
                                    name: "Anyone with Link",
                                    id: id,
                                    email: emailAddress,
                                    role: role,
                                    type: type,
                                    inFiles: [{id: file.id, name: file.name, origin: file.cloudOrigin}]
                                })
                            }
                        }
                    })
            }
        })
        setExistingUsers(existingPerms);
    },[files])


    const handleToggleModal = () => {
        setShowConfirmModal(!showConfirmModal)
    }

    const executeUpdate = (filesToUpdate) => {
        updateMultipleFiles(filesToUpdate);
        toggleModal();
        if (closeInfo) {
            closeInfo();
        }
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
            let filesToUpdate = files.map((file) => (
                {
                    name: file.name,
                    fileId: file.id,
                    updatedUsers: [],
                    newUsers: [],
                    origin: file.cloudOrigin,
                }
            ));
            updatedUsers.forEach(user => {
                filesToUpdate.forEach((fileToUpdate) => {
                    if (user.inFiles.some((file) => file.id === fileToUpdate.fileId)) {
                        fileToUpdate.updatedUsers.push(user)
                    } else {
                        fileToUpdate.newUsers.push(user)
                    }
                })
            })
            newUsers.forEach(user => {
                filesToUpdate.forEach((fileToUpdate) => {
                    delete user.inFiles
                    fileToUpdate.newUsers.push(user)
                })
            })
            if (snapshots.length > 0) {
                let violates = await checkReqsBeforeUpdate(filesToUpdate)
                if (violates) {
                    setShowConfirmModal(true)
                    setStoredFilesToUpdate(filesToUpdate)
                } else {
                    executeUpdate(filesToUpdate)
                }
            } else {
                executeUpdate(filesToUpdate)
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
                setErrorMsg(newEmail + " already exists as a shared user of one/some of these files!")
            }
            else if (!addedUsers.find((user) => user.email === newEmail)) {
                addedUsers.push({
                    email: newEmail,
                    role: "writer",
                    type: "user",
                    inFiles: files.map(file => ({id: file.id, name: file.name, origin: file.cloudOrigin}))
                })
                setNewUsers(addedUsers);
            }
            setNewEmail("");
        }
    }

    return (
        <>
            <div className="modal-background">
                <div className="modal-container multiple-sharing-modal-container">
                    <div className="modal-header">
                        <span>Existing Users</span>
                        <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                    </div>
                    <div className="modal-section">
                        <div className="modal-section-title">Existing Users:</div>
                        <div className="modal-users-list">
                            {existingUsers.length !== 0 ?
                                existingUsers.map((user) => {
                                    const {name, id, origin, role, inFiles} = user;
                                    return (
                                        <div className="modal-user-item" key={id}>
                                            <div>
                                                <div className="modal-user-name">{name}</div>
                                                <div className="modal-user-email">
                                                <span className="existing-user-file-title">
                                                    {"Files: "}
                                                </span>
                                                    <span className="existing-user-files">
                                                    {
                                                        inFiles.map((file, index) => {
                                                            if (index === 0) {
                                                                return file.name
                                                            }
                                                            return ", " + file.name
                                                        })
                                                    }
                                                </span>
                                                </div>
                                            </div>
                                            {(role === "owner" || role === "organizer" || role === "fileOrganizer") ?
                                                <div className="modal-user-role">{role}</div>
                                                :
                                                <select defaultValue={role} onChange={(e) => addPendingUpdate(e, user)}>
                                                    <option value="writer">Writer</option>
                                                    <option value="reader">Reader</option>
                                                    <option value="commenter">Commenter</option>
                                                    <option value="unshared" >Unshared</option>
                                                </select>
                                            }
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
                                            </select>
                                        </div>
                                    )
                                })
                                :
                                <div className="no-users-message">No new users...</div>
                            }
                        </div>
                    </div>
                    <div className="modal-footnote">
                        <AiOutlineExclamationCircle size={25} />
                        <div>
                            Note, these changes are applied to all selected files.
                            Updated users from Existing Users list will be added if they dont already exist.
                        </div>
                    </div>
                    <div className="modal-footer">
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
                    performOperation={() => executeUpdate(storedFilesToUpdate)}
                />
            }
        </>
    );
}