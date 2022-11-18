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
    const [accessToken, setAccessToken] = useState(null);
    const isAuthenticated = useIsAuthenticated();
    const [allFiles, setAllFiles] = useState([]);

    useEffect(() => {
        if (!loggedIn) {
            return;
        }
        async function start(){
            console.log("Reach");
            startLoading();
            let token = await RequestAccessToken();
            console.log(token);
            console.log(isAuthenticated);
            if(isAuthenticated){
                if (token){
                    setAccessToken(token);
                    console.log("got access");
                    await getOneDriveFiles();
                }
                else{
                    console.log("reach");
                    setAllFiles([]);
                }
            }
            finishLoading();
        }
        start();        
    }, [finishLoading, loggedIn, startLoading, accessToken]);

    async function RequestAccessToken() {
      const request = {
          ...loginRequest,
          account: accounts[0]
      };
      // Silently acquires an access token which is then attached to a request for Microsoft Graph data
      instance.acquireTokenSilent(request).then((response) => {
        console.log(response);
        return response.accessToken;
        //   setAccessToken(response.accessToken);
      }).catch((e) => {
        //   instance.acquireTokenPopup(request).then((response) => {
        //       setAccessToken(response.accessToken);
        //   });
      });
    }

    const getOneDriveFiles = useCallback(async ()=>{
        let res = await api.getFiles({accessToken: accessToken});
        setAllFiles(res);
        console.log(res);
    },[])

    return (
        <OneDriveContext.Provider value={{
            accessToken, allFiles
        }}>
            {props.children}
        </OneDriveContext.Provider>
    );
}

export default OneDriveContextProvider;