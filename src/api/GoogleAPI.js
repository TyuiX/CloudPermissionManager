import {gapi} from "gapi-script";

export const getFiles = async () => {
    var accessToken = gapi.auth.getToken().access_token;

    fetch('https://www.googleapis.com/drive/v3/files/', {
        method: "GET",
        headers: new Headers({'Authorization': 'Bearer ' + accessToken})
    }).then((res) => {
        console.log(res.json())
    })
}