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

async function getPermissions(fileId){
    var accessToken = gapi.auth.getToken().access_token;
    
    return fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '/permissions', {
        method: "GET",
        headers: new Headers({'Authorization': 'Bearer ' + accessToken})
    })
}

// going to need to pass in an index here. the index is the index of the file in which we want to find the access permissions for.
export const getPermissionsStart = async () => {
    let permissions = [];
    let files = await getFiles();
    getPermissions(files[78].id).then((resp) => resp.json().then(response => permissions.push(response)));
    console.log(permissions);
    return(permissions)
}

//PATCH https://www.googleapis.com/drive/v3/files/fileId/permissions/permissionId
export const updatePermissionsStart = async () => {
    console.log("pquobgqube");
    getFiles().then (response => {getPermissionsStart(response[0].id).then((res) => console.log(res))}) 
}

async function updatePermissions(fileId, permId){
    console.log("fileId: " + fileId);
    console.log("PermId: " + permId);
}