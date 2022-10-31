import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";
import {InteractionRequiredAuthError, InteractionStatus,} from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { callMsGraph } from "../../components/pages/OneDriveAuth/graph";

export const OneDriveContext = createContext({});

function OneDriveContextProvider(props){
    const {user, loggedIn, startLoading, finishLoading } = useContext(UserContext)
    const { instance, inProgress, accounts } = useMsal();
    const [apiData, setApiData] = useState(null);

    useEffect(() => {
        if (!loggedIn) {
            return
        }
        console.log("in use effect");
        if (!apiData && inProgress === InteractionStatus.None) {
            const accessTokenRequest = {
              scopes: ["user.read"],
              account: accounts[0],
            };
            instance
              .acquireTokenSilent(accessTokenRequest)
              .then((accessTokenResponse) => {
                // Acquire token silent success
                let accessToken = accessTokenResponse.accessToken;
                console.log(accessToken);
                // Call your API with token
                callMsGraph(accessToken).then((response) => {
                  setApiData(response);
                });
              })
              .catch((error) => {
                if (error instanceof InteractionRequiredAuthError) {
                  instance
                    .acquireTokenPopup(accessTokenRequest)
                    .then(function (accessTokenResponse) {
                      // Acquire token interactive success
                      let accessToken = accessTokenResponse.accessToken;
                      // Call your API with token
                      callMsGraph(accessToken).then((response) => {
                        setApiData(response);
                      });
                    })
                    .catch(function (error) {
                      // Acquire token interactive failure
                      console.log(error);
                    });
                }
                console.log(error);
            });
        }
    }, [instance, accounts, inProgress, apiData]);

    return (
        <OneDriveContext.Provider value={{
            apiData
        }}>
            {props.children}
        </OneDriveContext.Provider>
    );
}

export default OneDriveContextProvider;