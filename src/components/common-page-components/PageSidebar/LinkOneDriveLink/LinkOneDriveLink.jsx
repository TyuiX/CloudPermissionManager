import React, {useContext, useState} from 'react';
import MicrosoftLogin from "react-microsoft-login";
import { msalConfig, loginRequest } from '../../../pages/OneDriveAuth/authConfig';
import {UserContext} from "../../../../utils/context/UserContext";
import {OneDriveContext} from "../../../../utils/context/OneDriveContext";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import {ImOnedrive} from "react-icons/im";
import "./LinkOneDriveLink.css";

export default function LinkOneDriveLink() {
    const {user, setOneDriveAcc, finishLoading} = useContext(UserContext);
    const {getOneDriveFiles} = useContext(OneDriveContext);
    const {accounts, instance, inProgress} = useMsal();
    const isAuthenticated = useIsAuthenticated();

    async function handleLogin(instance) {
        instance.loginPopup(loginRequest).catch(e => {
            onFailure(e);
        });
        await onSuccess();
    }   

    const onSuccess = async () => {
        // console.log(res)
        console.log("login success ");
        await setOneDriveAcc(user.email, accounts[0].username);
        await getOneDriveFiles();
    }

    const onFailure = (res) => {
        console.log("login failed: " + res);
    }

    return (
        <div>
            <button onClick={() => handleLogin(instance)}
            className="onedrive-account onedrive-login-link">
                <ImOnedrive size={20} />
                <span>Link one drive account</span>
            </button>
        </div>
    )
}