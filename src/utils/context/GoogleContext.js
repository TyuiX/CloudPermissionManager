import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import api from '../../api/GoogleAPI'
import sharingAPI from '../../api/ShareManagerAPI'
import {UserContext} from "./UserContext";
import {gapi} from "gapi-script";
import googleAuth from "../GoogleAuth";

export const GoogleContext = createContext({});

function GoogleContextProvider(props) {
    const [allFiles, setAllFiles] = useState([]);
    const [myFiles, setMyFiles] = useState([]);
    const [sharedFiles, setSharedFiles] = useState([]);
    const {user, loggedIn, startLoading, finishLoading } = useContext(UserContext)
    const [email, setEmail] = useState();

    useEffect(() => {
        if (!loggedIn) {
            return
        }
        const start = async () => {
            startLoading();
            await gapi.client.init(googleAuth).then(async () => {

                if (gapi.auth.getToken()) {

                    console.log(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().cu === user.googleId)

                    if (gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().cu === user.googleId) {
                        let files = await api.getFiles()
                        console.log(files)
                        const reformattedFiles = files.map(({id, name, mimeType, ownedByMe, permissions, shared, modifiedTime,
                                                                createdTime, owners, parents
                                                            }) => {
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
                                parents: parents,
                            }
                        });
                        let myFiles = reformattedFiles.filter((file) => file.ownedByMe || typeof file.ownedByMe === 'undefined');
                        let sharedFiles = reformattedFiles.filter((file) => file.ownedByMe === false);
                        setAllFiles(reformattedFiles)
                        setMyFiles(myFiles)
                        setSharedFiles(sharedFiles)
                        setEmail(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().cu);
                    }
                    else {
                        setAllFiles([])
                        setMyFiles([])
                        setSharedFiles([])
                        setEmail(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().cu);
                    }
                }
            })
            finishLoading();
        }
        gapi.load('client:auth2', start)
    }, [finishLoading, loggedIn, startLoading, user.googleId])

    const getGoogleFiles = useCallback( async () => {
        const getGoogleFiles = async () => {
            let files = await api.getFiles()
            const reformattedFiles = files.map(({id, name, mimeType, ownedByMe, permissions, shared, modifiedTime,
                                                    createdTime, owners, parents
                                                }) => {
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
                    parents: parents,
                }
            });
            let myFiles = reformattedFiles.filter((file) => file.ownedByMe || typeof file.ownedByMe === 'undefined');
            let sharedFiles = reformattedFiles.filter((file) => file.ownedByMe === false);
            setAllFiles(reformattedFiles)
            setMyFiles(myFiles)
            setSharedFiles(sharedFiles)
            setEmail(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().cu);
        }
        
        startLoading();
        await getGoogleFiles();
        finishLoading();
    }, [finishLoading, startLoading])

    const updateFilePerms = useCallback( async (fileId, updatedUsers, addedUsers) => {
        let accessToken = gapi.auth.getToken().access_token;
        await sharingAPI.updateFilePerms({fileId: fileId, updatedUsers: updatedUsers, addedUsers: addedUsers, accessToken: accessToken})
        await getGoogleFiles();
    }, [getGoogleFiles])

    return (
        <GoogleContext.Provider value={{
            allFiles, myFiles, sharedFiles, email, getGoogleFiles, updateFilePerms
        }}>
            {props.children}
        </GoogleContext.Provider>
    );
}

export default GoogleContextProvider;