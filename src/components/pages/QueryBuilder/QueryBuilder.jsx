import React, {useLocation, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import "./QueryBuilder.css";
import PageSideBar from '../../common-page-components/PageSidebar/PageSideBar';
import QBDriveModal from '../../modals/QBDriveModal/QBDriveModal';
import QBGenericModal from '../../modals/QBGenericModal/QBGenericModal';
import SearchBar from '../../common-page-components/PageHeader/SearchBar/SearchBar';
import { ThemeContext } from '../../common-page-components/PageHeader/SearchBar/SearchBar';

export default function QueryBuilder(props) {
    const { state } = useLocation();
    const [qMap, setQMap] = useState(new Map());
    const [currentValue, setCurrentValue] = useState("");
    const [showDriveModal, setShowDriveModal] = useState(false);
    const [showGenericModal, setShowGenericModal] = useState(false);
    const [fileName, setFileName] = useState("");
    const navigate = useNavigate();
    
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
            console.log("qmap");
            console.log(qMap);
        }
    }

    const handleToggleDriveModal = () => {
        setShowDriveModal(!showDriveModal);
    }

    const handleToggleGenericModal = () => {
        setShowGenericModal(!showGenericModal);
    }
    console.log(qMap);

    let queryOps = [];
    let params = 0;
    while(params < qBuilder.length){
        if(qMap.get(qBuilder[params]) !== undefined){
            queryOps.push(qMap.get(qBuilder[params]));
        }
        params += 1;
    }

    console.log(queryOps);
    console.log(qMap.get('owner:user'));
    
    let snapIndex = 0;
    let files = [];
    while(snapIndex < state.snapshots.length){
        let folderIndex = 0;
        let foldersIterate = state.snapshots[snapIndex].folders;
        // console.log(Object.values(foldersIterate)[0]);
        while(folderIndex < Object.keys(foldersIterate).length){
            let fileIndex = 0;
            while(fileIndex < Object.keys(foldersIterate)[folderIndex].length){
                // console.log(Object.values(Object.values(foldersIterate)[j])[k]);
                if(Object.values(Object.values(foldersIterate)[folderIndex])[fileIndex] !== undefined){
                    // console.log(Object.values(Object.values(foldersIterate)[j])[k].owner);
                    let file = Object.values(Object.values(foldersIterate)[folderIndex])[fileIndex];
                    let operators = 0;
                    while(operators < queryOps.length){
                        if(file.owner === queryOps[operators]){
                            files.push(file);
                        }
                        operators += 1;
                    }
                }
                fileIndex += 1;
            }
            folderIndex += 1;
        }
        snapIndex += 1;
    }

    console.log(files);
    // console.log(files.woiebg.owiergb);
    //<ThemeContext.Consumer >
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
                setFileName = {setFileName}
            />
        }
        </>
        // </ThemeContext.Consumer>
    )
}