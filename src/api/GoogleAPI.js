import {gapi} from "gapi-script";

export const getFiles = async () => {
    var accessToken = gapi.auth.getToken().access_token;
    let files = new Array();
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
    
    return fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '?q=parents&fields=*', {
        method: "GET",
        headers: new Headers({'Authorization': 'Bearer ' + accessToken})
    })
}

// going to need to pass in an index here. the index is the index of the file in which we want to find the access permissions for.
// @param: id 
export const getPermissionsStart = async (fileId) => {
    let perm = await getPermissions(fileId).then((resp) => resp.json().then(response => response));
    console.log(perm.permissions)
    return perm.permissions;
}

export const updatePermissionsStart = async (fileId, permId) => {
    let updated = await updatePermissions(fileId, permId);
    console.log(updated);
}

async function updatePermissions(fileId, permId){
    var accessToken = gapi.auth.getToken().access_token;
    
    return fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '/permissions/' + permId, { //  + '?transferOwnership=true'
        method: 'PATCH',
        headers: new Headers({'Authorization': 'Bearer ' + accessToken}),
        role: "owner",
        type: "user",
        domain: "global",
    }).then(resp => resp.json().then(res => console.log(res)).catch(err => console.log(err)))
}

export const addPermissionForUser = async(fileId) => {
    var accessToken = gapi.auth.getToken().access_token;
    
    return fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '/permissions', { //  , + '?sendNotificationEmail=true'
        method: 'POST',
        headers: new Headers({'Authorization': 'Bearer ' + accessToken}),
        role: "reader",
        type: "user",
        permission: ["reader"],
        emailAddress: "varunvinay.chotalia@stonybrook.edu",
    }).then(resp => resp.json().then(res => console.log(res)).catch(err => console.log(err)))
    
}
