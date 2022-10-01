import {gapi} from "gapi-script";

var accessToken = gapi.auth.getToken().access_token;

export const getFiles = async () => {

    fetch('https://www.googleapis.com/drive/v3/files', {
        method: "GET",
        headers: new Headers({'Authorization': 'Bearer ' + accessToken})
    }).then((response) => response.json())
        .then((responseJSON) => {
            // do stuff with responseJSON here...
            console.log(responseJSON);
            if (responseJSON.nextPageToken) {
                getNextPage(responseJSON.nextPageToken)
            }
        });
}

export const getNextPage = async (pageToken) => {

    fetch(`https://www.googleapis.com/drive/v3/files?pageToken=${pageToken}`, {
        method: "GET",
        headers: new Headers({'Authorization': 'Bearer ' + accessToken})
    }).then((response) => response.json())
        .then((responseJSON) => {
            // do stuff with responseJSON here...
            console.log(responseJSON);
            if (responseJSON.nextPageToken) {
                getNextPage(responseJSON.nextPageToken)
            }
        });
}