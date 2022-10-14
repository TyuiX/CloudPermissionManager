// import * as api from "../../api/GoogleAPI"
// import * as serverRoute from "../../api/ShareManagerAPI"

// //handle getting all file and format it as an snapshot then send it to backend
// export  function handleGetFile(){
//     api.getFiles().then(async data => {
//         let snapshot = {
//             //going be double map structure
//             folders: new Map(),
//             //root folder id
//             root: null

//         }
//         let rootCandidate = new Set()
//         const loggedInUser = localStorage.getItem("user");
//         let user
//         if (loggedInUser) {
//             user = JSON.parse(loggedInUser);
//         }
//         for (let i of data){
//             if (i.ownedByMe){
//                 await api.getPermissionsStart(i.id).then(data => i.perm = data);
//                 if(i.parents === undefined) { 
//                     console.log("here"); 
//                     snapshot.root = [...rootCandidate][0]
//                     serverRoute.createSnapshot({snapshot:snapshot, email: user.email})
//                     return; 
//                 }
//                 if (snapshot.folders.has(i.parents[0])){
//                     snapshot.folders.get(i.parents[0]).set(i.id , i)
//                 }
//                 else{
//                     snapshot.folders.set(i.parents[0], new Map)
//                     snapshot.folders.get(i.parents[0]).set(i.id, i)
//                     rootCandidate.add(i.parents[0])
//                 }
//                 if (rootCandidate.has(i.id)){
//                     rootCandidate.delete(i.id)

//                 }
//             }
//         }
//         snapshot.root = [...rootCandidate][0]
//         console.log(snapshot);
//         // snapshot = JSON.stringify(snapshot);
//         snapshot.folders = JSON.stringify(Object.fromEntries(snapshot.folders));
//         console.log(snapshot);
//         serverRoute.createSnapshot({snapshot:snapshot, email: user.email})
     
//     })
    
// }

import * as api from "../../api/GoogleAPI"
import * as serverRoute from "../../api/ShareManagerAPI"

//handle getting all file and format it as an snapshot then send it to backend
export  function handleGetFile(){
    api.getFiles().then(async data => {
        let snapshot = {
            //going be double map structure
            folders: new Map(),
            //root folder id
            root: null

        }
        let rootCandidate = new Set()
        const loggedInUser = localStorage.getItem("user");
        let user
        if (loggedInUser) {
            user = JSON.parse(loggedInUser);
        }
        for (let i of data){
            if (i.ownedByMe){
                await api.getPermissionsStart(i.id).then(resdata => {
                    let map = new Map()
                    for (let j of resdata){
                        map.set(j.id, j)
                    }
                    i.perm = Object.fromEntries(map)
                    console.log(data)
                    console.log("file")
                    console.log(i.name)
                })
                console.log("permission")
                console.log(i.permissions)
                if (snapshot.folders.has(i.parents[0])){
                    snapshot.folders.get(i.parents[0]).set(i.id , i)
                }
                else{
                    snapshot.folders.set(i.parents[0], new Map)
                    snapshot.folders.get(i.parents[0]).set(i.id, i)
                    rootCandidate.add(i.parents[0])
                }
                if (rootCandidate.has(i.id)){
                    rootCandidate.delete(i.id)

                }
            }

        }
        snapshot.root = [...rootCandidate][0]
        let key = snapshot.folders.keys();
        for (let i of key){
            snapshot.folders.set(i , Object.fromEntries(snapshot.folders.get(i)))
        }
        console.log("hi");
        snapshot.folders = Object.fromEntries(snapshot.folders)
        serverRoute.createSnapshot({snapshot:snapshot, email: user.email})
    
    })
    
}

// import * as api from "../../api/GoogleAPI"
// import * as serverRoute from "../../api/ShareManagerAPI"
// import {gapi} from "gapi-script";
// //handle getting all file and format it as an snapshot then send it to backend
// export  function handleGetFile(){
//     const loggedInUser = localStorage.getItem("user");
//     let user
//     if (loggedInUser) {
//         user = JSON.parse(loggedInUser);
//     }
//     api.getFiles().then(async data => {
//         let accessToken = gapi.auth.getToken().access_token;
//         serverRoute.createSnapshot({data:data, email: user.email, accessToken: accessToken})
    
//     })
    
// }
// //handle unformatted data, pass the snapshot data to this to return the map of folders that double map with the second map for file data
// export async function handlerawData(data){
//     // console.log("reach raw");
//     let folders =  new Map()
//     for (let i of data){
//         if (i.ownedByMe){
//             if(i.parents != undefined) { 
//                 await api.getPermissionsStart(i.id).then(resdata => {
//                     let map = new Map()
//                     for (let j of resdata){
//                         map.set(j.id, j)
//                     }
//                     i.perm = map
//                 })
//                 if (folders.has(i.parents[0])){
//                     folders.get(i.parents[0]).set(i.id , i)
//                 }
//                 else{
//                     folders.set(i.parents[0], new Map)
//                     folders.get(i.parents[0]).set(i.id, i)
//                 }
//             }
//         }
//     }
//     return folders

// }