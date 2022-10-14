import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import SnapCell from "../../common-page-components/SnapCell/SnapCell"; 
import "../index.css";
import * as api from "../../../api/GoogleAPI"


export default function MySnapshots(props) {
    // api.getGroups();
    const {newSnap, snapshot} = props;

    let firstSnap = null;
    let secondSnap = [];
    
    if(snapshot.length !== 0){
        firstSnap = snapshot.data[0];
        secondSnap = snapshot.data;
        // console.log([...firstSnap.folders.entries()]);
        console.log(firstSnap);
        console.log(secondSnap);
    }
    console.log("in my snap");
    console.log(snapshot);

    return (
        <div className="page-container">
            <PageSideBar />
            <div className="page-content">
                <h2 className="page-content-header">My Snapshots</h2>
                    <>
                        <h3 className="category-title">Recent Snapshot:</h3>
                        <p className="page-content-all-the-way"> id: {firstSnap?firstSnap._id:""} <br></br> date: {firstSnap?firstSnap.date:""} </p> 
                        <h3 className="category-title">Older Snapshots:</h3>
                        <div> {secondSnap.slice(1).map((snap) => (
                                    <SnapCell key={snap?snap._id:""}
                                              snapInfo={snap?snap:""}
                                    />
                                ))} </div>
                    </>
                    <h2> <button className="newSnap" onClick={newSnap}>Add Snapshot</button></h2>
            </div>
            
           
        </div>
    );
}