import React, {useState, useContext} from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton"
import { callMsGraph, callGetSubFiles, createOneDriveSnapshot } from "./graph";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { UserContext } from "../../../utils/context/UserContext";
/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    const {createNewSnapshot, user} = useContext(UserContext);
    const { instance, accounts, inProgress } = useMsal();
    const [accessToken, setAccessToken] = useState(null);
    const [graphData, setGraphData] = useState(null);

    const name = accounts[0] && accounts[0].name;

    async function RequestAccessToken() {
        let files = [];
        const request = {
            ...loginRequest,
            account: accounts[0]
        };

        // Silently acquires an access token which is then attached to a request for Microsoft Graph data
        instance.acquireTokenSilent(request).then((response) => {
            setAccessToken(response.accessToken);
            // files = response.accessToken;
        }).catch((e) => {
            instance.acquireTokenPopup(request).then((response) => {
                setAccessToken(response.accessToken);
            });
        });
        // return files;
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

    const handleClick = async () =>{
        if(isAuthenticated){
            // console.log(name);
            RequestAccessToken();
            // RequestProfileData();
            // console.log(graphData);
            // callGetSubFiles(accessToken);
            // console.log(apiData);
            createOneDriveSnapshot(accessToken, createNewSnapshot, user);
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