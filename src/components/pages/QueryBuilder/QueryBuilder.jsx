import React, {useLocation, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import "./QueryBuilder.css";
import PageSideBar from '../../common-page-components/PageSidebar/PageSideBar';
import QBDriveModal from '../../modals/QBDriveModal/QBDriveModal';
import QBGenericModal from '../../modals/QBGenericModal/QBGenericModal';

const QUERIES =
    [
        "drive:drive", "owner:user", "creator:user", "from:user", "to:user", "readable:user", "writeable:user",
        "shareable:user", "name:regexp", "inFolder:regexp", "folder:regexp", "path:path", "sharing:none",
        "sharing:anyone", "sharing:individual", "sharing:domain"
    ]

export default function QueryBuilder(props) {
    const { state } = useLocation();
    const [qMap, setQMap] = useState(new Map());
    const [currentValue, setCurrentValue] = useState("");
    const [showDriveModal, setShowDriveModal] = useState(false);
    const [showGenericModal, setShowGenericModal] = useState(false);
    const [fileName, setFileName] = useState("");
    const navigate = useNavigate();

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
    console.log(qMap);

    let queryOps = [];
    let params = 0;
    while(params < QUERIES.length){
        if(qMap.get(QUERIES[params]) !== undefined){
            queryOps.push(qMap.get(QUERIES[params]));
        }
        params += 1;
    }

    console.log(queryOps);
    console.log(qMap.get('owner:user'));
    console.log(qMap);
    
    let files = [];
    console.log(qMap);
    console.log(state.snapshots)

    // snapshot.folders.forEach(folder => {
    //     folder.forEach(file => {
    //       if (file.owner === qMap.get('owner:user')) {
    //         files.push(file)
    //       }
    //     }
    // )})
    
    let folderIndex = 0;
    console.log(state.snapshots);
    let foldersIterate = state.snapshots[0].folders;
    let set = new Set();
    // console.log(Object.values(foldersIterate)[0]);
    console.log(queryOps);
    while(folderIndex < Object.keys(foldersIterate).length){
        let fileIndex = 0;
        while(fileIndex < Object.keys(foldersIterate)[folderIndex].length){
            // console.log(Object.values(Object.values(foldersIterate)[j])[k]);
            if(Object.values(Object.values(foldersIterate)[folderIndex])[fileIndex] !== undefined){
                // console.log(Object.values(Object.values(foldersIterate)[j])[k].owner);
                let file = Object.values(Object.values(foldersIterate)[folderIndex])[fileIndex];
                console.log(file);
                qMap.forEach((key, value) => {
                    // console.log("key: " + key + ", value: " + value);
                    if(value === "drive:drive"){
                        if(key === "My Drive"){
                            if(file.ownedByMe === true){
                                if(!set.has(file.name)){
                                    set.add(file.name);
                                    files.push(file);
                                }
                            }
                        } else{
                            if(file.ownedByMe === false){
                                if(!set.has(file.name)){
                                    set.add(file.name);
                                    files.push(file);
                                }
                            }
                        }
                    }
                    else if(value === "owner:user"){
                        if(file.owner === key){
                            if(!set.has(file.name)){
                                set.add(file.name);
                                files.push(file);
                            }
                        }
                    } else if(value === "creator:user"){
                        if(file.creator === key){
                            if(!set.has(file.name)){
                                set.add(file.name);
                                files.push(file);
                            }
                        }
                    } else if(value === "readable:user"){
                        let permIndex = 0;
                        while(permIndex < file.permissions.length){
                            // console.log(file.permissions[permIndex]);
                            if(file.permissions[permIndex].displayName === key){
                                if(file.permissions[permIndex].role === "reader"){
                                    if(!set.has(file.name)){
                                        set.add(file.name);
                                        files.push(file);
                                    }
                                }
                            }
                            permIndex += 1;
                        }
                    } else if(value === "writeable:user"){
                        let permIndex = 0;
                        while(permIndex < file.permissions.length){
                            // console.log(file.permissions[permIndex]);
                            if(file.permissions[permIndex].displayName === key){
                                if(file.permissions[permIndex].role === "writer"){
                                    if(!set.has(file.name)){
                                        set.add(file.name);
                                        files.push(file);
                                    }
                                }
                            }
                            permIndex += 1;
                        }
                    } else if(value === "to:user"){
                        let permIndex = 0;
                        while(permIndex < file.permissions.length){
                            // console.log(file.permissions[permIndex]);
                            if(file.permissions[permIndex].displayName === key){
                                if(!set.has(file.name)){
                                    set.add(file.name);
                                    files.push(file);
                                }
                            }
                            permIndex += 1;
                        }
                    } else if(value === "from:user"){
                        if(file.owner === key){
                            if(!set.has(file.name)){
                                set.add(file.name);
                                files.push(file);
                            }
                        }
                    } else if(value === "name:regexp"){
                        let regexp = new RegExp(key);
                        if(regexp.exec(file.name)){ // key is the regular expression.
                            if(!set.has(file.name)){
                                set.add(file.name);
                                files.push(file);
                            }
                        }
                    }
                })
            }
            fileIndex += 1;
        }
        folderIndex += 1;
    }

    console.log(files);
    console.log(qMap);
    return (
        <>
            <div className="page-container">
                <PageSideBar/>
                <div className="parentDiv">
                    <div className={"dataResult"}>
                        {QUERIES.map((value) => {
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
    )
}