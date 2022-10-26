import React, {useContext} from 'react';
import {UserContext} from "../../../../utils/context/UserContext";

export default function ExistingControlReqModalPage() {
    const {controlReqs, deleteControlReq} = useContext(UserContext);

    return (
        <>
            <div className="modal-section">
                <div className="modal-section-title">Existing Access Control Requirements</div>
                {controlReqs.length !== 0 &&
                    controlReqs.map(({_id}) => (
                        <button onClick={() => deleteControlReq(_id)}>{_id}</button>
                    ))
                }
            </div>
        </>
    );
}