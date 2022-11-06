import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import api from '../../api/GoogleAPI'
import {UserContext} from "./UserContext";
import {gapi} from "gapi-script";
import googleAuth from "../GoogleAuth";

export const GoogleContext = createContext({});

function GoogleContextProvider(props) {
    const [allFiles, setAllFiles] = useState([]);
    const [myFiles, setMyFiles] = useState([]);
    const [sharedFiles, setSharedFiles] = useState([]);
    const [sharedDrives, setSharedDrives] = useState([]);
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
                        await getGoogleFiles()
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
            let accessToken = gapi.auth.getToken().access_token;
            let res = await api.getFiles({accessToken: accessToken})
            const {files, drives} = res.data;
            if (files === undefined) {
                return;
            }
            console.log(res)
            const reformattedFiles = files.map(({id, name, mimeType, ownedByMe, permissions, shared, modifiedTime,
                                                    createdTime, owners, parents, driveId
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
                    owner: owners ? owners[0].emailAddress : undefined,
                    creator: owners ? owners[owners.length - 1].emailAddress : undefined,
                    ownedByMe: ownedByMe,
                    permissions: permissions,
                    shared: shared,
                    lastUpdatedOn: modifiedTime,
                    createdOn: createdTime,
                    cloudOrigin: "google",
                    parents: parents,
                    driveId: driveId,
                }
            });
            let sharedDrives = drives.map(({id, name}) => (
                {
                    id: id,
                    name: name,
                    sharedFiles: []
                }
            ))
            let myDrive = [];
            reformattedFiles.forEach((file) => {
                if (drives.length > 0) {
                    if (file.driveId) {
                        console.log(file.driveId)
                        console.log(file)
                        let index = sharedDrives.findIndex(drive => drive.id === file.driveId)
                        sharedDrives[index].sharedFiles.push(file)
                    } else {
                        myDrive.push(file)
                    }
                } else {
                    myDrive.push(file)
                }
            })
            console.log(sharedDrives)
            console.log(myDrive)

            let myFiles = myDrive.filter((file) => file.ownedByMe || typeof file.ownedByMe === 'undefined');
            let sharedFiles = myDrive.filter((file) => file.ownedByMe === false);
            setAllFiles(reformattedFiles)
            setMyFiles(myFiles)
            setSharedFiles(sharedFiles)
            setSharedDrives(sharedDrives)
            setEmail(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().cu);
        }
        
        startLoading();
        await getGoogleFiles();
        finishLoading();
    }, [finishLoading, startLoading])

    const updateFilePerms = useCallback( async (fileId, updatedUsers, addedUsers, updateMultiple) => {
        let accessToken = gapi.auth.getToken().access_token;
        await api.updateFilePerms({
            fileId: fileId, updatedUsers: updatedUsers, addedUsers: addedUsers,
            accessToken: accessToken, userEmail: user.email
        })
        if (!updateMultiple) {
            await getGoogleFiles();
        }
    }, [getGoogleFiles, user.email])

    const updateMultipleFiles = useCallback( async (files) => {
        for (const {fileId, updatedUsers, newUsers} of files) {
            await updateFilePerms(fileId, updatedUsers, newUsers, true);
        }
        await getGoogleFiles();
    }, [getGoogleFiles, updateFilePerms])

    return (
        <GoogleContext.Provider value={{
            allFiles, myFiles, sharedFiles, email, getGoogleFiles, updateFilePerms, updateMultipleFiles, sharedDrives
        }}>
            {props.children}
        </GoogleContext.Provider>
    );
}

export default GoogleContextProvider;