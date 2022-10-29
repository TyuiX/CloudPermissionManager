import React, {useNavigate} from 'react-router-dom';
import {useContext, useState} from 'react';
import "./QueryBuilder.css";
import QBDriveModal from '../../../../modals/QBDriveModal/QBDriveModal';
import QBGenericModal from '../../../../modals/QBGenericModal/QBGenericModal';
import {UserContext} from "../../../../../utils/context/UserContext";

const QUERIES =
    [
        "drive:drive", "owner:user", "creator:user", "from:user", "to:user", "readable:user", "writeable:user",
        "shareable:user", "name:regexp", "inFolder:regexp", "folder:regexp", "path:path", "sharing:none",
        "sharing:anyone", "sharing:individual", "sharing:domain"
    ]

export default function QueryBuilder(props) {
    const {currentSnap, toggleDropdown} = props;
    const {performSearch} = useContext(UserContext);
    const [existingQueriesMap, setExistingQueriesMap] = useState(new Map());
    const [selectedQueryOp, setSelectedQueryOp] = useState("");
    const [showDriveModal, setShowDriveModal] = useState(false);
    const [showGenericModal, setShowGenericModal] = useState(false);
    const navigate = useNavigate();

    const handleSelectQueryOp = (query) => {
        setSelectedQueryOp(query);
        if(query === "drive:drive"){
            handleToggleDriveModal();
        }
        else{
            handleToggleGenericModal();
            console.log("qmap");
            console.log(existingQueriesMap);
        }
    }

    const handleToggleDriveModal = () => {
        setShowDriveModal(!showDriveModal);
    }

    const handleToggleGenericModal = () => {
        console.log("in here");
        setShowGenericModal(!showGenericModal);
    }

    const confirmQuery = () => {
        console.log("wger");
        performSearch(currentSnap, existingQueriesMap, true);
        toggleDropdown()
        navigate('/searchresults');
    }

    console.log(existingQueriesMap);
    console.log(selectedQueryOp);
    console.log(showGenericModal);
    return (
        <>
            <div className="dataResult">
                {QUERIES.map((query) => (
                    <>
                        <button onClick={()=>handleSelectQueryOp(query)}  className="listOfButtons">
                            {query}
                        </button>
                        <br></br>
                    </>
                ))}
            </div>
            {showDriveModal &&
                <QBDriveModal
                    toggleModal={handleToggleDriveModal}
                    setQMap={setExistingQueriesMap}
                    qMap={existingQueriesMap}
                />
            }
            {showGenericModal &&
                <QBGenericModal
                    toggleModal={handleToggleGenericModal}
                    setQMap={setExistingQueriesMap}
                    qMap={existingQueriesMap}
                    currentValue={selectedQueryOp}
                />
            }
            <button onClick={confirmQuery} className="executeButton">execute search</button>
        </>
    )
}