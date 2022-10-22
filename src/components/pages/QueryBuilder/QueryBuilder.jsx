import React, {useLocation} from 'react-router-dom';
import {useState} from 'react';
import "./QueryBuilder.css";
import PageSideBar from '../../common-page-components/PageSidebar/PageSideBar';
import QBDriveModal from '../../modals/QBDriveModal/QBDriveModal';
import QBGenericModal from '../../modals/QBGenericModal/QBGenericModal';

export default function QueryBuilder(props) {
    // const {state} = useLocation();
    // const{qMap, setQMap} = state;
    const [qMap, setQMap] = useState(new Map());
    const [currentValue, setCurrentValue] = useState("");
    const [showDriveModal, setShowDriveModal] = useState(false);
    const [showGenericModal, setShowGenericModal] = useState(false);

    let qBuilder = [];
    qBuilder.push("drive:drive");
    qBuilder.push("owner:user");
    qBuilder.push("creator:user");
    qBuilder.push("from:user");
    qBuilder.push("to:user");
    qBuilder.push("readable:user");
    qBuilder.push("writeable:user");
    qBuilder.push("shareable:user");
    qBuilder.push("owner:user");
    qBuilder.push("name:regexp");
    qBuilder.push("inFolder:regexp");
    qBuilder.push("folder:regexp");
    qBuilder.push("path:path");
    qBuilder.push("sharing:none");
    qBuilder.push("sharing:anyone");
    qBuilder.push("sharing:individual");
    qBuilder.push("sharing:domain");

    const forOnClick = (value) => {
        setCurrentValue(value);
        if(value === "drive:drive"){
            handleToggleDriveModal();
        }
        else{
            handleToggleGenericModal();
            // console.log("qmap");
            console.log(qMap);
        }

    }

    const handleToggleDriveModal = () => {
        setShowDriveModal(!showDriveModal);
    }

    const handleToggleGenericModal = () => {
        setShowGenericModal(!showGenericModal);
    }

    return (
        <>
        
        <div className="page-container">
            <PageSideBar/>
            <div className="parentDiv">
                <div className={"dataResult"}>
                    {qBuilder.map((value) => {
                        return (
                            <>
                            <button onClick={()=>forOnClick(value)}  className={"listOfButtons"} href="#">
                                <p>{value}</p>
                            </button>
                            <br></br>
                            </>
                        );
                    })}
                </div> 
            </div>

        </div>
        {showDriveModal &&
            <QBDriveModal
                toggleModal={handleToggleDriveModal} setQMap={setQMap} qMap={qMap}
            />
        }
        {showGenericModal &&
            <QBGenericModal 
                toggleModal={handleToggleGenericModal} setQMap={setQMap} qMap={qMap} currentValue={currentValue}
            />
        }
        </>
    )
}