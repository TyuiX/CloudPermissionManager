import PageSideBar from "../../common-page-components/PageSidebar/PageSideBar";
import SnapCell from "../../common-page-components/SnapCell/SnapCell"; 
import "../index.css";


export default function MySnapshots(props) {
    const {newSnap, snapshot} = props;

    let firstSnap = null;
    let secondSnap = [];
    
    if(snapshot.length !== 0){
        console.log(snapshot);
        firstSnap = snapshot.data[0];
        secondSnap = snapshot.data;
    }

    
    
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
                                    <SnapCell key={snap._id}
                                              snapInfo={snap}
                                    />
                                ))} </div>
                    </>
                    <h2> <button className="newSnap" onClick={newSnap}>Add Snapshot</button></h2>
            </div>
            
           
        </div>
    );
}