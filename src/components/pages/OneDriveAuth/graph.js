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

export async function callGetSubFiles(accessToken){
    getSubFiles(accessToken, "016R5WTWYLRE5I7DGCONDISRUYU7XOR6FJ").then((res)=>{
        res.json().then((data)=> {
            // console.log(data);
        });
    });
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

export async function createOneDriveSnapshot(accessToken){
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
        if (file.folder != undefined){
            file.type = "folder"
            await getOneDriveHelper(accessToken, file.id, snapshot)
        }
        else {
            file.type = "file"
        }
        snapshot.folders.get("root").set(file.id, file)
    }
    console.log(snapshot);
    // createNewSnapshot(snapshot, user.email, "oneDrive")
}

async function getOneDriveHelper(accessToken, folderid ,snapshot){
    let folderFiles = await getSubFiles(accessToken, folderid)
    folderFiles = folderFiles.value;
    snapshot.folders.set(folderid, new Map())
    for (let file of folderFiles){
        if (file.folder != undefined){
            file.type = "folder"
            await getOneDriveHelper(accessToken, file.id, snapshot)
        }
        else {
            file.type = "file"
        }
        snapshot.folders.get(folderid).set(file.id, file)
    }
}