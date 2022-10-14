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
                await api.getPermissionsStart(i.id).then(data => i.perm = data)
                if(i.parents !== undefined) { 
                    if (snapshot.folders.has(i.parents[0])){
                    snapshot.folders.get(i.parents[0]).set(i.id , i)
                    }
                    else{
                        snapshot.folders.set(i.parents[0], new Map())
                        snapshot.folders.get(i.parents[0]).set(i.id, i)
                        rootCandidate.add(i.parents[0])
                    }
                    if (rootCandidate.has(i.id)){
                        rootCandidate.delete(i.id);
                    }
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
