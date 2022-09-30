import React from 'react';
import {GoogleLogin} from "react-google-login";
import googleAuth from "../../utils/GoogleAuth";

export default function CloudSharingManager() {

    const onSuccess = async (res) => {
        console.log("login success: ", res.profileObj);
    }

    const onFailure = (res) => {
        console.log("login failed: " + res);
    }

    return (
        <div>
            <GoogleLogin
                clientId={googleAuth.clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                isSignedIn={true}
            />
        </div>
    )
}