import React, {useContext} from 'react';
import { loginRequest } from '../../../pages/OneDriveAuth/authConfig';
import {UserContext} from "../../../../utils/context/UserContext";
import {OneDriveContext} from "../../../../utils/context/OneDriveContext";
import { useMsal } from "@azure/msal-react";
import {ImOnedrive} from "react-icons/im";
import "./LinkOneDriveLink.css";

export default function LinkOneDriveLink() {
    const {user, setOneDriveAcc} = useContext(UserContext);
    const {getOneDriveFiles, RequestAccessToken} = useContext(OneDriveContext);
    const {accounts, instance} = useMsal();

    async function handleLogin(instance) {
        instance.loginPopup(loginRequest).catch(e => {
            onFailure(e);
        });
        await onSuccess();
    }   

    const onSuccess = async () => {
        console.log("login success ");
        await setOneDriveAcc(user.email, accounts[0].username);
        let token = await RequestAccessToken();
        await getOneDriveFiles(token);
    }

    const onFailure = (res) => {
        console.log("login failed: " + res);
    }

    return (
        <div>
            <button onClick={() => handleLogin(instance)}
            className="onedrive-account onedrive-login-link">
                <ImOnedrive size={20} />
                <span>Link One Drive account</span>
            </button>
        </div>
    )
}