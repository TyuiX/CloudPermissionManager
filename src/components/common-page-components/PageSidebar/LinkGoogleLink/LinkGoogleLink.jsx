import React from 'react';
import {GoogleLogin} from "react-google-login";
import googleAuth from "../../../../utils/GoogleAuth";

export default function LinkGoogleLink() {

    const onSuccess = async (res) => {
        console.log(res)
        console.log("login success: ", res.profileObj);

        // refreshTokenSetup(res)
    }

    const onFailure = (res) => {
        console.log("login failed: " + res);
    }

    // const refreshTokenSetup = (res) => {
    //     let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000
    //
    //     const refreshToken = async () => {
    //         const newAuthRes = await res.reloadAuthResponse();
    //         refreshTiming = (newAuthRes.tokenObj.expires_in || 3600 - 5 * 60) * 1000
    //         setTimeout(refreshToken, refreshTiming)
    //     }
    //     setTimeout(refreshToken, refreshTiming)
    // }

    return (
        <div>
            <GoogleLogin
                clientId={googleAuth.clientId}
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                isSignedIn={true}
                buttonText="Link Google account"
            />
        </div>
    )
}