import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";
import api from '../../api/OneDriveAPI'
import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../../components/pages/OneDriveAuth/authConfig";
// import {gapi} from "gapi-script";

export const OneDriveContext = createContext({});

function OneDriveContextProvider(props){
    const {user, loggedIn, startLoading, finishLoading, isLoading } = useContext(UserContext);
    const { instance, inProgress, accounts } = useMsal();
    const [accessToken, setAccessToken] = useState("");
    const isAuthenticated = useIsAuthenticated();
    const [allFiles, setAllFiles] = useState([]);
    const [myFiles, setMyFiles] = useState([]);
    const [sharedFiles, setSharedFiles] = useState([]);
    const [ODemail, setODEmail] = useState("");
    const [ODdata, setODdata] = useState([]);

    useEffect(() => {
        if (!loggedIn) {
            return;
        }
        const start = async () =>{
            startLoading();
            // const token = await RequestAccessToken();
            if(!ODdata){
                // if (ODdata){
                //     setAccessToken(ODdata.accessToken);
                //     setODEmail(ODdata.account.userName);
                //     await getOneDriveFiles(ODdata);
                // }
                {
                    setAllFiles([]);
                    setMyFiles([]);
                    setSharedFiles([]);
                    setODEmail("");
                }
            }
            finishLoading();
        }
        start();      
        // gapi.load('client:auth2', start)  
    }, [loggedIn, startLoading, ODdata]);

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

    console.log(isLoading);
    const getOneDriveFiles = useCallback(async (data) => {
        startLoading();
        console.log(isLoading);
        console.log("in get")
        setAccessToken(data.accessToken);
        setODdata(data);
        let res = await api.getMyFiles({accessToken: data.accessToken});
        let myFiles = res.data.myFiles;
        res = await api.getSharedFiles({accessToken: data.accessToken});
        let sharedFiles = res.data.sharedFiles;
        let allFiles = myFiles.concat(sharedFiles);
        setAllFiles(allFiles);
        setMyFiles(myFiles);
        setSharedFiles(sharedFiles);
        setODEmail(data.account.userName);
        finishLoading();
    },[finishLoading, startLoading])

    return (
        <OneDriveContext.Provider value={{
            accessToken, allFiles, myFiles, sharedFiles, ODemail, getOneDriveFiles, RequestAccessToken
        }}>
            {props.children}
        </OneDriveContext.Provider>
    );
}

export default OneDriveContextProvider;