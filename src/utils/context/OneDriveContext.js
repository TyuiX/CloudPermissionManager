import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";
import api from '../../api/OneDriveAPI'
import {InteractionRequiredAuthError, InteractionStatus,} from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { callMsGraph } from "../../components/pages/OneDriveAuth/graph";
import { useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../../components/pages/OneDriveAuth/authConfig";

export const OneDriveContext = createContext({});

function OneDriveContextProvider(props){
    const {user, loggedIn, startLoading, finishLoading } = useContext(UserContext);
    const { instance, inProgress, accounts } = useMsal();
    const [accessToken, setAccessToken] = useState("");
    const isAuthenticated = useIsAuthenticated();
    const [allFiles, setAllFiles] = useState([]);
    console.log(allFiles);

    useEffect(() => {
        if (!loggedIn) {
            return;
        }
        const start = async () =>{
            startLoading();
            const token = await RequestAccessToken();
            if(isAuthenticated){
                if (token){
                    setAccessToken(token);
                    console.log("got access");
                    const files = await getOneDriveFiles();
                    setAllFiles(files);
                    // const snap = await createOneDriveSnapshot();
                    // console.log(snap);
                }
                else{
                    console.log("reach");
                    setAllFiles([]);
                }
            }
            finishLoading();
        }
        start();        
    }, [finishLoading, loggedIn, startLoading, isAuthenticated, accessToken]);

    async function RequestAccessToken() {
        let files = [];
        const request = {
            ...loginRequest,
            account: accounts[0]
        };
        // Silently acquires an access token which is then attached to a request for Microsoft Graph data
        await instance.acquireTokenSilent(request).then((response) => {
            files = response.accessToken;
        }).catch((e) => {
            //   instance.acquireTokenPopup(request).then((response) => {
            //       setAccessToken(response.accessToken);
            //   });
        });
        return files;
    }

    const getOneDriveFiles = useCallback(async ()=>{
        let res = await api.getFiles({accessToken: accessToken});
        console.log(res.data.files.value);
        return res.data.files.value;
    },[accessToken, allFiles])

    async function getSubFiles(folderId){
        let emp = "" + folderId;
        let files = []; 
        await fetch("https://graph.microsoft.com/v1.0/me/drive/items/"+emp+"/children", {
            method: "GET",
            headers: {'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',}
        }).then(async res => {
            await res.json().then(function(data) {
                files = data;
              });
            })
        return files;
    }
    
    async function getRootFiles(){
        // const headers = new Headers({'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',});
        let rootFiles = [];
        await fetch("https://graph.microsoft.com/v1.0/me/drive/root/children", {
            method: "GET",
            headers: {'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',}
        }).then(async res => {
            await res.json().then(function(data) {
                rootFiles = data;
              });
            })
        return rootFiles;
    }
    
    async function getPermissions(folderId){
        let files = [];
        await fetch("https://graph.microsoft.com/v1.0/me/drive/items/"+ folderId +"/permissions", {
            method: "GET",
            headers: {'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',}
        }).then(async res => {
            await res.json().then(function(data) {
                files = data;
              });
            })
        return files;
    }
    
    async function createOneDriveSnapshot(){
        let snapshot = {
            //going be double map structure
            folders: new Map(),
            //root folder id
            root: "root"
        }
        snapshot.folders.set("root", new Map());
        let rootFiles = await getRootFiles();
        rootFiles = rootFiles.value;
        for (let file of rootFiles){
            file.permissions = await getPermissions(file.id);
            file.permissions = file.permissions.value;
            file.perm = new Map();
            for (let per of file.permissions){
                file.perm.set(per.id, per);
            }
            if (file.folder != undefined){
                file.type = "folder"
                await getOneDriveHelper(file.id, snapshot)
            }
            else {
                file.type = "file"
            }
            snapshot.folders.get("root").set(file.id, file)
        }
        console.log(snapshot);
        return snapshot
        // createNewSnapshot(snapshot, user.email, "oneDrive")
    }
    
    async function getOneDriveHelper(folderid ,snapshot){
        let folderFiles = await getSubFiles(folderid)
        folderFiles = folderFiles.value;
    
        snapshot.folders.set(folderid, new Map())
        for (let file of folderFiles){
            file.permissions = await getPermissions(file.id);
            file.permissions = file.permissions.value;
            file.perm = new Map();
            for (let per of file.permissions){
                file.perm.set(per.id, per);
            }
            if (file.folder != undefined){
                file.type = "folder"
                await getOneDriveHelper(file.id, snapshot)
            }
            else {
                file.type = "file"
            }
            snapshot.folders.get(folderid).set(file.id, file)
        }
    }

    return (
        <OneDriveContext.Provider value={{
            accessToken, allFiles
        }}>
            {props.children}
        </OneDriveContext.Provider>
    );
}

export default OneDriveContextProvider;