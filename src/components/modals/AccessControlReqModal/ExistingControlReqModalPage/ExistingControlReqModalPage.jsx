import React, {useContext} from 'react';
import {UserContext} from "../../../../utils/context/UserContext";
import ControlReqInfoBlock from "./ControlReqInfoBlock/ControlReqInfoBlock";
import "./ExistingControlReqModalPage.css";

export default function ExistingControlReqModalPage(props) {
    const {controlReqs, deleteControlReq} = useContext(UserContext);
    const {postUpdate} = props;

    return (
        <>
            <div className="modal-section">
                <div className="modal-section-title">Existing Access Control Requirements</div>
                {controlReqs.length !== 0 ?
                    controlReqs.map((req, index) => (
                        <ControlReqInfoBlock
                            key={index}
                            reqInfo={req}
                            index={index + 1}
                            deleteControlReq={deleteControlReq}
                            postUpdate={postUpdate}
                        />
                    ))
                    :
                    <div className="no-existing-reqs">
                        <div className="no-existing-reqs-msg">No existing User Access Control Requirements</div>
                    </div>

                }
            </div>
        </>
    );
}