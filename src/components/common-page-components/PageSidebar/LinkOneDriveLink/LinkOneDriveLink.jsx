import React, {useContext} from 'react';
import { loginRequest, msalConfig } from '../../../pages/OneDriveAuth/authConfig';
import {UserContext} from "../../../../utils/context/UserContext";
import {OneDriveContext} from "../../../../utils/context/OneDriveContext";
import { useMsal } from "@azure/msal-react";
import {ImOnedrive} from "react-icons/im";
import MicrosoftLogin from "react-microsoft-login";
import "./LinkOneDriveLink.css";

export default function LinkOneDriveLink() {
    const {user, setOneDriveAcc} = useContext(UserContext);
    const {getOneDriveFiles, RequestAccessToken} = useContext(OneDriveContext);
    const {accounts, instance} = useMsal();

    // async function handleLogin(instance) {
    //     instance.loginPopup(loginRequest).catch(e => {
    //         onFailure(e);
    //     });
    //     await onSuccess();
    // }   
    const loginHandler = async(err, data, msal) => {
        console.log(err, data);
        // some actions
        if (!err && data) {
            await onSuccess(data);
        }
        if(err){
            onFailure(err);
        }
      };

    const onSuccess = async (data) => {
        console.log("login success ");
        console.log(data)
        await setOneDriveAcc(user.email, data.account.userName);
        // let token = await RequestAccessToken();
        await getOneDriveFiles(data);
    }

    const onFailure = (res) => {
        console.log("login failed: " + res);
    }

    return (
        <div>
            {/* <button onClick={() => handleLogin(instance)}
            className="onedrive-account onedrive-login-link">
                <ImOnedrive size={20} />
                <span>Link One Drive account</span>
            </button> */}
            <MicrosoftLogin 
                clientId ={msalConfig.auth.clientId}
                authCallback={loginHandler}
                useLocalStorageCache={true}
                redirectUri={msalConfig.auth.redirectUri}
            />
        </div>
    )
}