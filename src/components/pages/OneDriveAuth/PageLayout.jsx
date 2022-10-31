import React, {useState, useContext} from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton"
import { callMsGraph } from "./graph";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { OneDriveContext } from "../../../utils/context/OneDriveContext";
/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    const {apiData} = useContext(OneDriveContext);

    const { instance, accounts, inProgress } = useMsal();
    const [accessToken, setAccessToken] = useState(null);
    const [graphData, setGraphData] = useState(null);

    const name = accounts[0] && accounts[0].name;

    function RequestAccessToken() {
        const request = {
            ...loginRequest,
            account: accounts[0]
        };

        // Silently acquires an access token which is then attached to a request for Microsoft Graph data
        instance.acquireTokenSilent(request).then((response) => {
            setAccessToken(response.accessToken);
        }).catch((e) => {
            instance.acquireTokenPopup(request).then((response) => {
                setAccessToken(response.accessToken);
            });
        });
    }

    async function RequestProfileData() {
        const request = {
            ...loginRequest,
            account: accounts[0]
        };

        // Silently acquires an access token which is then attached to a request for Microsoft Graph data
        instance.acquireTokenSilent(request).then((response) => {
            callMsGraph(response.accessToken).then(response => 
                console.log(response),
                setGraphData(response));
        }).catch((e) => {
            instance.acquireTokenPopup(request).then((response) => {
                callMsGraph(response.accessToken).then(response => setGraphData(response));
            });
        });
        // if(accessToken)
        //     callMsGraph(accessToken).then(response => setGraphData(response));
    }

    const handleClick = () =>{
        if(isAuthenticated){
            // console.log(name);
            // RequestAccessToken();
            // console.log(accessToken);
            RequestProfileData();
            console.log(graphData);
            // console.log(apiData);
        }
    }

    return (
        <>
            { isAuthenticated ? <SignOutButton /> : <SignInButton /> }
            <button onClick={handleClick}>Get file</button>
            {props.children}
        </>
    );
};