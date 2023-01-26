import React, {useContext} from 'react';
import {GoogleLogin} from "react-google-login";
import googleAuth from "../../../../utils/GoogleAuth";
import {UserContext} from "../../../../utils/context/UserContext";
import {gapi} from "gapi-script";
import {GoogleContext} from "../../../../utils/context/GoogleContext";

export default function LinkGoogleLink() {
    const {user, setGoogleAcc} = useContext(UserContext);
    const {getGoogleFiles} = useContext(GoogleContext);

    const onSuccess = async (res) => {
        console.log(res)
        console.log("login success: ", res.profileObj);

        await setGoogleAcc(user.email, gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().cu);
        await getGoogleFiles();
    }

    const onFailure = (res) => {
        console.log("login failed: " + res);
    }

    return (
        <div>
            <GoogleLogin
                clientId={googleAuth.clientId}
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                buttonText="Link Google account"
            />
        </div>
    )
}