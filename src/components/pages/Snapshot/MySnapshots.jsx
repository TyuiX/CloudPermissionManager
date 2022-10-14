import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import SnapCell from "../../common-page-components/SnapCell/SnapCell"; 
import "../index.css";
import {useContext} from "react";
import {GoogleContext} from "../../../utils/context/GoogleContext";
import {UserContext} from "../../../utils/context/UserContext";

export default function MySnapshots() {
    const {myFiles} = useContext(GoogleContext);
    const {snapshots, createNewSnapshot} = useContext(UserContext);

    const createSnapshotData = () => {
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

        myFiles.forEach((file) => {
            const {id, parents, permissions} = file;
            if(parents !== undefined) {
                let fileCopy = JSON.parse(JSON.stringify(file));
                let newPerms = new Map();
                for (let perm of permissions) {
                    newPerms.set(perm.id, perm)
                }
                fileCopy.perm = Object.fromEntries(newPerms)
                console.log(fileCopy)

                if (snapshot.folders.has(parents[0])){
                    snapshot.folders.get(parents[0]).set(id, fileCopy)
                }
                else{
                    snapshot.folders.set(parents[0], new Map())
                    snapshot.folders.get(parents[0]).set(id, fileCopy)
                    rootCandidate.add(parents[0])
                }
                if (rootCandidate.has(id)){
                    rootCandidate.delete(id);
                }
            }
        })
        snapshot.root = [...rootCandidate][0]
        let key = snapshot.folders.keys();
        for (let i of key){
            snapshot.folders.set(i , Object.fromEntries(snapshot.folders.get(i)))
        }
        snapshot.folders = Object.fromEntries(snapshot.folders)
        console.log(snapshot)
        createNewSnapshot(snapshot, user.email)
    }

    let firstSnap = null;
    let secondSnap = [];

    if(snapshots.length !== 0){
        console.log(snapshots);
        firstSnap = snapshots[0];
        secondSnap = snapshots;
    }

    return (
        <div className="page-container">
            <PageSideBar />
            <div className="page-content">
                <h2 className="page-content-header">My Snapshots</h2>
                {snapshots &&
                    <>
                        <h3 className="category-title">Recent Snapshot:</h3>
                        <p className="page-content-all-the-way"> id: {firstSnap?firstSnap._id:""} <br></br> date: {firstSnap?firstSnap.date:""} </p>
                        <h3 className="category-title">Older Snapshots:</h3>
                        <div> {secondSnap.slice(1).map((snap) => (
                            <SnapCell key={snap._id}
                                      snapInfo={snap}
                            />
                        ))} </div>
                    </>
                }
                <h2> <button className="newSnap" onClick={createSnapshotData}>Add Snapshot</button></h2>
            </div>
            
           
        </div>
    );
}