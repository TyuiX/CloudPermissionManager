import {gapi} from "gapi-script";

const getDefaultRequestParams = (accessToken) => ({
    method: "GET",
    headers: new Headers({'Authorization': 'Bearer ' + accessToken,
        'Content-type': 'application/json; charset=UTF-8',}),
})

export const getFiles = async () => {
    let accessToken = gapi.auth.getToken().access_token;
    let files = [];
    let nextToken;

    await fetch('https://www.googleapis.com/drive/v3/files?fields=*',
        getDefaultRequestParams(accessToken)
    ).then((response) => response.json())
        .then(async (responseJSON) => {
            files = responseJSON.files;
            nextToken = responseJSON.nextPageToken;
            while (nextToken) {
                await fetch(`https://www.googleapis.com/drive/v3/files?pageToken=${nextToken}`,
                    getDefaultRequestParams(accessToken))
                    .then((response) => response.json())
                    .then((responseJSON) => {
                        files = files.concat(responseJSON.files)
                        nextToken = responseJSON.nextPageToken;
                    });
            }
        });

    return(files);
}
export const getFileInfo = async (fileId) => {
    var accessToken = gapi.auth.getToken().access_token;
    let temp = await fetch('https://www.googleapis.com/drive/v3/files/' + fileId, {
        method: "GET",
        headers: new Headers({'Authorization': 'Bearer ' + accessToken})
    })
    console.log(temp);
    return temp;
}

// going to need to pass in an index here. the index is the index of the file in which we want to find the access permissions for.
// @param: id
export const getPermissionsStart = async (fileId) => {
    let perm = await getPermissions(fileId).then((resp) => resp.json().then(response => response));
    return perm.permissions;
}

async function getPermissions(fileId){
    let accessToken = gapi.auth.getToken().access_token;

    return fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '/permissions?fields=*', {
        method: "GET",
        headers: new Headers({'Authorization': 'Bearer ' + accessToken})
    })
}

const googleAPI = {
    getFiles,
    getPermissionsStart,
    getFileToShow: getFileInfo,
}

export default googleAPI