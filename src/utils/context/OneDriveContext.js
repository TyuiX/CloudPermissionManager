import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";
import api from '../../api/OneDriveAPI'
import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../../components/pages/OneDriveAuth/authConfig";
// import {gapi} from "gapi-script";

export const OneDriveContext = createContext({});

function OneDriveContextProvider(props){
    const {user, loggedIn, startLoading, finishLoading } = useContext(UserContext);
    const { instance, inProgress, accounts } = useMsal();
    const [accessToken, setAccessToken] = useState("");
    const isAuthenticated = useIsAuthenticated();
    const [allFiles, setAllFiles] = useState([]);
    const [myFiles, setMyFiles] = useState([]);
    const [sharedFiles, setSharedFiles] = useState([]);
    const [ODemail, setODEmail] = useState();

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
                    setODEmail(accounts[0].username);
                    await getOneDriveFiles(token);
                }
                else{
                    setAllFiles([]);
                    setMyFiles([]);
                    setSharedFiles([]);
                    if(accounts)
                        setODEmail(accounts[0].username);
                    console.log(ODemail)
                }
            }
            finishLoading();
        }
        start();      
        // gapi.load('client:auth2', start)  
    }, [finishLoading, loggedIn, startLoading, isAuthenticated]);

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

    const getOneDriveFiles = useCallback(async (token) => {
        const getOneDriveFiles = async(token) =>{
            let res = await api.getMyFiles({accessToken: token});
            let myFiles = res.data.myFiles;
            res = await api.getSharedFiles({accessToken: token});
            let sharedFiles = res.data.sharedFiles;
            let allFiles = myFiles.concat(sharedFiles);
            setAllFiles(allFiles);
            setMyFiles(myFiles);
            setSharedFiles(sharedFiles);
            setODEmail(accounts[0].username);
        }
        startLoading();
        await getOneDriveFiles(token);
        finishLoading();
    },[finishLoading, startLoading, accessToken])

    return (
        <OneDriveContext.Provider value={{
            accessToken, allFiles, myFiles, sharedFiles, ODemail, getOneDriveFiles
        }}>
            {props.children}
        </OneDriveContext.Provider>
    );
}

export default OneDriveContextProvider;