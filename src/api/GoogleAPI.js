import {gapi} from "gapi-script";

export const getFiles = async () => {
    var accessToken = gapi.auth.getToken().access_token;
    let files = [];
    let nextToken;

    await fetch('https://www.googleapis.com/drive/v3/files', {
        method: "GET",
        headers: new Headers({'Authorization': 'Bearer ' + accessToken})
    }).then((response) => response.json())
        .then(async (responseJSON) => {
            files = responseJSON.files
            nextToken = responseJSON.nextPageToken;
            while (nextToken) {
                await fetch(`https://www.googleapis.com/drive/v3/files?pageToken=${nextToken}`, {
                    method: "GET",
                    headers: new Headers({'Authorization': 'Bearer ' + accessToken})
                }).then((response) => response.json())
                    .then((responseJSON) => {
                        files = files.concat(responseJSON.files)
                        nextToken = responseJSON.nextPageToken;
                        console.log(responseJSON);
                    });
            }
        });
    console.log(files)
    return(files)
}