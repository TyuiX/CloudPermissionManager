import React, {useContext, useState} from 'react';
import {AiOutlineClose} from "react-icons/ai";
import ErrorPopupModal from "../ErrorPopupModal/ErrorPopupModal";
import "./UploadGroupModal.css";
import {UserContext} from "../../../utils/context/UserContext";

export default function UploadGroupModal(props) {
    const {toggleModal} = props
    const [selectedFileData, setSelectedFileData] = useState("");
    const [errorMsg, setErrorMsg] = useState("")
    const {createNewGroupSnapshot, setIsLoading} = useContext(UserContext);

    const handleConfirm = async (e) => {
        e.preventDefault()
        if (!selectedFileData.includes("groups.google.com")) {
            setErrorMsg("Please input a valid HTML file of a Google Groups' Members page to create a new Group Snapshot")
        } else {
            setIsLoading(true)
            const emailRegex = /"[\w._-]+@googlegroups.com/g
            const memRegex = /mailto:[\w._-]+@[\w._-]+"/g

            // grab google groups email
            const email = selectedFileData.match(emailRegex)[0].slice(1)
            // grab each member's emails
            const mailtoRefs = [...selectedFileData.matchAll(memRegex)];
            let members = mailtoRefs.map((mailtos) =>
                mailtos[0].split("mailto:")[1].slice(0, -1)
            )

            await createNewGroupSnapshot(members, email)
            setIsLoading(false)
            toggleModal()
        }
    }

    const previewFile = () => {
        const [file] = document.querySelector('input[type=file]').files;
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            // this will then display a text file
            setSelectedFileData(reader.result)
        }, false);

        if (file) {
            reader.readAsText(file);
        } else {
            setSelectedFileData("")
        }
    }

    return (
        <>
            <div className="modal-background">
                <div className="modal-container upload-grp-modal-container">
                    <div className="modal-header">
                        <span>{"Upload Group Membership"}</span>
                        <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                    </div>
                    <div className="modal-section">
                        <input className="upload-file-button" type="file" onChange={previewFile}/>
                    </div>
                    <div className="modal-footer">
                        <button className="modal-button modal-confirm" onClick={e => handleConfirm(e)}>Confirm</button>
                        <button className="modal-button modal-cancel" onClick={toggleModal}>Cancel</button>
                    </div>
                </div>
            </div>
            {errorMsg &&
                <ErrorPopupModal msg={errorMsg} updateText={setErrorMsg} />
            }
        </>
    );
}