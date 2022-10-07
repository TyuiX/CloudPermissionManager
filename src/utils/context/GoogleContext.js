import React, {createContext, useContext, useEffect, useState} from "react";
import api from '../../api/GoogleAPI'
import {UserContext} from "./UserContext";
import {gapi} from "gapi-script";
import googleAuth from "../GoogleAuth";

export const GoogleContext = createContext({});

function GoogleContextProvider(props) {
    const [allFiles, setAllFiles] = useState([]);
    const [myFiles, setMyFiles] = useState([]);
    const [sharedFiles, setSharedFiles] = useState([]);
    const { loggedIn } = useContext(UserContext)
    const [email, setEmail] = useState();

    console.log(email)

    useEffect(() => {
        if (!loggedIn) {
            return
        }
        const start = () => {
            gapi.client.init(googleAuth).then(async () => {
                    let files = await api.getFiles()
                    console.log(files);
                    const reformattedFiles = files.map(({id, name, mimeType, ownedByMe, permissions, shared, modifiedTime, createdTime,
                                       owners}) => {
                        let type;
                        switch (mimeType) {
                            case "application/vnd.google-apps.folder":
                                type = "folder";
                                break;
                            default:
                                type = "file";
                                break;
                        }
                        return {
                            name: name,
                            id: id,
                            type: type,
                            owner: owners ? owners[0].displayName : undefined,
                            creator: owners ? owners[owners.length - 1].displayName : undefined,
                            ownedByMe: ownedByMe,
                            permissions: permissions,
                            shared: shared,
                            lastUpdatedOn: modifiedTime,
                            createdOn: createdTime,
                            cloudOrigin: "google",
                        }
                    });
                    console.log(reformattedFiles);
                    let myFiles = reformattedFiles.filter((file) => file.ownedByMe || typeof file.ownedByMe === 'undefined');
                    let sharedFiles = reformattedFiles.filter((file) => file.ownedByMe === false);
                    console.log(myFiles)
                    console.log(sharedFiles)
                    setAllFiles(reformattedFiles)
                    setMyFiles(myFiles)
                    setSharedFiles(sharedFiles)
                    setEmail(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().cu);
                }
            )
        }
        gapi.load('client:auth2', start)
    }, [loggedIn])

    return (
        <GoogleContext.Provider value={{
            allFiles, myFiles, sharedFiles, email
        }}>
            {props.children}
        </GoogleContext.Provider>
    );
}

export default GoogleContextProvider;