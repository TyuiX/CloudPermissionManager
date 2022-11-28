import { graphConfig } from "./authConfig";


/**
 * Attaches a given access token to a Microsoft Graph API call. Returns information about the user
 */
export async function callMsGraph(accessToken) {
    const headers = new Headers({'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',});
    // const bearer = `Bearer ${accessToken}`;

    // headers.append("Authorization", bearer);

    const options = {
        // mode: 'no-cors',
        // dataType: "jsonp",
        method: "GET",
        headers: headers
    };

    if(graphConfig.graphMeEndpoint === undefined){
        console.log("is undefined");
    }

    let id = "";
    return fetch(graphConfig.graphMeEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error)).then(e => {
            fetch("https://graph.microsoft.com/v1.0/me/drive/root/children", {
                method: "GET",
                headers: headers
            }).then(res => {
                (res.json().then(function(data) {
                    (   console.log(data));
                        //await getSubFiles(accessToken, data.value[0].id).then(data=>console.log(data)));
                  }));
            }).catch(err => {
                console.log(err); 
            })

            fetch("https://graph.microsoft.com/v1.0/me/drive/items/016R5WTWYLRE5I7DGCONDISRUYU7XOR6FJ/permissions", {
                method: "GET",
                headers: headers
            }).then(res => {
                console.log(res.json().then(function(data) {
                    console.log(data);
                  }));
            }).catch(err => {
                console.log(err); 
            })

            id = e.id;
            console.log(e);
        });
}

async function getRootSharedWithMeFiles(accessToken){
    // const headers = new Headers({'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',});
    let rootFiles = [];
    await fetch("https://graph.microsoft.com/v1.0/me/drive/sharedWithMe", {
        method: "GET",
        headers: {'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',}
    }).then(async res => {
        await res.json().then(function(data) {
            rootFiles = data;
          });
        })
    return rootFiles;
}

async function getSubSharedWithMeFiles(accessToken, driveId, itemId){
    let files = []; 
    await fetch("https://graph.microsoft.com/v1.0/drives/" + driveId + "/items/" + itemId + "/children", {
        method: "GET",
        headers: {'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',}
    }).then(async res => {
        await res.json().then(function(data) {
            files = data;
          });
        })
    return files;
}

async function getSharedWithMePermissions(accessToken, driveId, itemId){
    let files = []; 
    await fetch("https://graph.microsoft.com/v1.0/drives/" + driveId + "/items/" + itemId + "/permissions", {
        method: "GET",
        headers: {'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',}
    }).then(async res => {
        await res.json().then(function(data) {
            files = data;
          });
        })
    return files;
}

export async function getAllSharedWithMeSnapshots(accessToken, snapshot){
    let rootFiles = await getRootSharedWithMeFiles(accessToken);
    rootFiles = rootFiles.value;
    for(let file of rootFiles){
        if(file.remoteItem)
            file = file.remoteItem;
        file.permissions = await getSharedWithMePermissions(accessToken, file.parentReference.driveId, file.id);
        file.permissions = file.permissions.value;
        if(!file.permissions)
            break;
        let newPerm = new Map();
        for (let per of file.permissions){
            if(per.grantedToV2 == undefined){
                per.grantedToV2 = per.grantedToIdentitiesV2;
            }
            newPerm.set(per.id, per);
        }
        file.perm = Object.fromEntries(newPerm);
        if (file.folder != undefined){
            file.type = "folder"
            await getRecursiveSharedWithMeSnapshots(accessToken, file.parentReference.driveId, file.id, snapshot)
        }
        else {
            file.type = "file"
        }
        snapshot.folders.get("root").set(file.id, file);
    }
}

async function getRecursiveSharedWithMeSnapshots(accessToken, driveId, itemId, snapshot){
    let folderFiles = await getSubSharedWithMeFiles(accessToken, driveId, itemId);
    folderFiles = folderFiles.value;
    snapshot.folders.set(itemId, new Map())
    if(folderFiles){
        for (let file of folderFiles){
            if(file.remoteItem)
                file = file.remoteItem;
            file.permissions = await getSharedWithMePermissions(accessToken, file.parentReference.driveId, file.id);
            file.permissions = file.permissions.value;
            if(!file.permissions)
                break;
            let newPerm = new Map();
            for (let per of file.permissions){
                if(per.grantedToV2 == undefined){
                    per.grantedToV2 = per.grantedToIdentitiesV2;
                }
                newPerm.set(per.id, per);
            }
            file.perm = Object.fromEntries(newPerm)
            if (file.folder != undefined){
                file.type = "folder"
                await getRecursiveSharedWithMeSnapshots(accessToken, file.parentReference.driveId, file.id, snapshot);
            }
            else {
                file.type = "file"
            }
            snapshot.folders.get(itemId).set(file.id, file)
        }
    }
}

export async function getAllSharedWithMeFiles(accessToken){
    let allShared = [];
    let rootFiles = await getRootSharedWithMeFiles(accessToken);
    rootFiles = rootFiles.value;
    for(let file of rootFiles){
        if(file.remoteItem)
            file = file.remoteItem;
        file.permissions = await getSharedWithMePermissions(accessToken, file.parentReference.driveId, file.id);
        file.permissions = file.permissions.value;
        if(!file.permissions)
            break;
        let newPerm = new Map();
        for (let per of file.permissions){
            if(per.grantedToV2 == undefined){
                per.grantedToV2 = per.grantedToIdentitiesV2;
            }
            newPerm.set(per.id, per);
        }
        file.perm = Object.fromEntries(newPerm);
        if (file.folder != undefined){
            file.type = "folder"
            await getRecursiveSharedWithMeFiles(accessToken, file.parentReference.driveId, file.id, allShared)
        }
        else {
            file.type = "file"
        }
        allShared.push(file);
    }
    return allShared;
}

async function getRecursiveSharedWithMeFiles(accessToken, driveId, itemId, allShared){
    let folderFiles = await getSubSharedWithMeFiles(accessToken, driveId, itemId);
    folderFiles = folderFiles.value;
    if(folderFiles){
        for (let file of folderFiles){
            if(file.remoteItem)
                file = file.remoteItem;
            file.permissions = await getSharedWithMePermissions(accessToken, file.parentReference.driveId, file.id);
            file.permissions = file.permissions.value;
            if(!file.permissions)
                break;
            let newPerm = new Map();
            for (let per of file.permissions){
                if(per.grantedToV2 == undefined){
                    per.grantedToV2 = per.grantedToIdentitiesV2;
                }
                newPerm.set(per.id, per);
            }
            file.perm = Object.fromEntries(newPerm)
            if (file.folder != undefined){
                file.type = "folder"
                await getRecursiveSharedWithMeFiles(accessToken, file.parentReference.driveId, file.id, allShared);
            }
            else {
                file.type = "file"
            }
            allShared.push(file);
        }
    }
}

export async function getSubFiles(accessToken, folderId){
    let emp = "" + folderId;
    let files = []; 
    await fetch("https://graph.microsoft.com/v1.0/me/drive/items/"+emp+"/children", {
        method: "GET",
        headers: {'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',}
    }).then(async res => {
        await res.json().then(function(data) {
            files = data;
          });
        })
    return files;
}

async function getRootFiles(accessToken){
    // const headers = new Headers({'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',});
    let rootFiles = [];
    await fetch("https://graph.microsoft.com/v1.0/me/drive/root/children", {
        method: "GET",
        headers: {'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',}
    }).then(async res => {
        await res.json().then(function(data) {
            rootFiles = data;
          });
        })
    return rootFiles;
}

async function getPermissions(accessToken, folderId){
    let files = [];
    await fetch("https://graph.microsoft.com/v1.0/me/drive/items/"+ folderId +"/permissions", {
        method: "GET",
        headers: {'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',}
    }).then(async res => {
        await res.json().then(function(data) {
            files = data;
          });
        })
    return files;
}

export async function createOneDriveSnapshot(accessToken, createNewSnapshot, user){
    let snapshot = {
        //going be double map structure
        folders: new Map(),
        //root folder id
        root: "root"
    }
    snapshot.folders.set("root", new Map());
    let rootFiles = await getRootFiles(accessToken);
    rootFiles = rootFiles.value;
    for (let file of rootFiles){
        file.permissions = await getPermissions(accessToken, file.id);
        file.permissions = file.permissions.value;
        let newPerm = new Map();
        for (let per of file.permissions){
            if(per.grantedToV2 == undefined){
                per.grantedToV2 = per.grantedToIdentitiesV2;
            }
            newPerm.set(per.id, per);
        }
        file.perm = Object.fromEntries(newPerm);
        if (file.folder != undefined){
            file.type = "folder"
            await getOneDriveHelper(accessToken, file.id, snapshot)
        }
        else {
            file.type = "file"
        }
        snapshot.folders.get("root").set(file.id, file)
    }
    await getAllSharedWithMeSnapshots(accessToken, snapshot);
    let key = snapshot.folders.keys();
    for (let i of key){
        snapshot.folders.set(i , Object.fromEntries(snapshot.folders.get(i)))
    }
    snapshot.folders = Object.fromEntries(snapshot.folders)
    createNewSnapshot(snapshot, user.email, "oneDrive");
}

async function getOneDriveHelper(accessToken, folderid ,snapshot){
    let folderFiles = await getSubFiles(accessToken, folderid)
    folderFiles = folderFiles.value;
    snapshot.folders.set(folderid, new Map())
    for (let file of folderFiles){
        file.permissions = await getPermissions(accessToken, file.id);
        file.permissions = file.permissions.value;
        let newPerm = new Map();
        for (let per of file.permissions){
            if(per.grantedToV2 == undefined){
                per.grantedToV2 = per.grantedToIdentitiesV2;
            }
            newPerm.set(per.id, per);
        }
        file.perm = Object.fromEntries(newPerm)
        if (file.folder != undefined){
            file.type = "folder"
            console.log(file.perm);
            await getOneDriveHelper(accessToken, file.id, snapshot)
        }
        else {
            file.type = "file"
        }
        snapshot.folders.get(folderid).set(file.id, file)
    }
}

export async function getMyFiles(accessToken){
    let myFiles = [];
    let rootFiles = await getRootFiles(accessToken);
    rootFiles = rootFiles.value;
    for (let file of rootFiles){
        file.permissions = await getPermissions(accessToken, file.id);
        file.permissions = file.permissions.value;
        console.log(file.permissions);
        let newPerm = new Map();
        for (let per of file.permissions){
            if(per.grantedToV2 == undefined){
                per.grantedToV2 = per.grantedToIdentitiesV2;
            }
            newPerm.set(per.id, per);
        }
        file.perm = Object.fromEntries(newPerm);
        if (file.folder != undefined){
            file.type = "folder"
            await getMyFilesRecursive(accessToken, file.id, myFiles)
        }
        else {
            file.type = "file"
        }
        myFiles.append(file);
    }
    return myFiles;
}

async function getMyFilesRecursive(accessToken, folderid , myFiles){
    let folderFiles = await getSubFiles(accessToken, folderid)
    folderFiles = folderFiles.value;
    for (let file of folderFiles){
        file.permissions = await getPermissions(accessToken, file.id);
        file.permissions = file.permissions.value;
        let newPerm = new Map();
        for (let per of file.permissions){
            if(per.grantedToV2 == undefined){
                per.grantedToV2 = per.grantedToIdentitiesV2;
            }
            newPerm.set(per.id, per);
        }
        file.perm = Object.fromEntries(newPerm)
        if (file.folder != undefined){
            file.type = "folder"
            console.log(file.perm);
            await getMyFilesRecursive(accessToken, file.id, myFiles)
        }
        else {
            file.type = "file"
        }
        myFiles.append(file);
    }
}
