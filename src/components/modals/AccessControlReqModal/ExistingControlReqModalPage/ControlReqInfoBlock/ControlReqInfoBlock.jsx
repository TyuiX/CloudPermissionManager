import React, {useContext, useState} from 'react';
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import "./ControlReqInfoBlock.css";
import ExistingControlReqTypeSection from "../ExistingControlReqTypeSection/ExistingControlReqTypeSection";
import ConfirmActionModal from "../../../ConfirmActionModal/ConfirmActionModal";
import {UserContext} from "../../../../../utils/context/UserContext";

export default function ControlReqInfoBlock(props) {
    const {deleteControlReq} = useContext(UserContext)
    const {reqInfo, postUpdate} = props;
    const {query, aw, ar, dw, dr, grp, _id} = reqInfo;
    const [openDropdown, setOpenDropdown] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const handleToggleModal = () => {
        setShowModal(!showModal)
    }

    const handleDeleteReq = () => {
        deleteControlReq(_id);
        postUpdate()
    }

    return reqInfo && (
        <>
            <div className="control-req-info-block">
                <div className="req-info-header"
                     onClick={() => setOpenDropdown(!openDropdown)}
                >
                    <span className="control-req-header-title">Query: {query}</span>
                    {openDropdown ?
                        <IoIosArrowUp size={20}/>
                        :
                        <IoIosArrowDown size={20}/>
                    }
                </div>
                {
                    openDropdown &&
                    <>
                        <div className="existing-access-req-info-pair">
                            <div className="access-req-pair-key">Full Query:</div>
                            <div className="access-req-pair-value">{query}</div>
                        </div>
                        <div className="existing-access-req-info-pair">
                            <div className="access-req-pair-key">Account for Group Mem. :</div>
                            <div className="access-req-pair-value">{grp ? "True" : "False"}</div>
                        </div>
                        <ExistingControlReqTypeSection label={"Allowed Writers"} users={aw} />
                        <ExistingControlReqTypeSection label={"Allowed Readers"} users={ar} />
                        <ExistingControlReqTypeSection label={"Denied Writers"} users={dw} />
                        <ExistingControlReqTypeSection label={"Denied Readers"} users={dr} />
                        <button className="modal-button modal-delete" onClick={handleToggleModal}>Delete</button>
                    </>
                }
            </div>
            {showModal &&
                <ConfirmActionModal
                    msg={"This action is irreversible! Once confirmed, you will not be able to recover this Access Control Requirement."}
                    toggleModal={handleToggleModal}
                    performOperation={handleDeleteReq}
                />
            }
        </>
    );
}