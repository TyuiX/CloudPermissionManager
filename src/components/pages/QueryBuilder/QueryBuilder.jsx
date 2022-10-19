import React, {Navigate, useLocation} from 'react-router-dom';
import "./QueryBuilder.css";
import PageSideBar from '../../common-page-components/PageSidebar/PageSideBar';

export default function QueryBuilder(props) {
   
    let qBuilder = [];
    qBuilder.push("drive:drive");
    qBuilder.push("owner:user");
    qBuilder.push("creator:user");
    qBuilder.push("from:user");
    qBuilder.push("to:user");
    qBuilder.push("readable:user");
    qBuilder.push("writeable:user");
    qBuilder.push("shareable:user");
    qBuilder.push("owner:user");
    qBuilder.push("name:regexp");
    qBuilder.push("inFolder:regexp");
    qBuilder.push("folder:regexp");
    qBuilder.push("path:path");
    qBuilder.push("sharing:none");
    qBuilder.push("sharing:anyone");
    qBuilder.push("sharing:individual");
    qBuilder.push("sharing:domain");

    const forOnClick = (event) => {
        console.log(event);
        
    }

    return (
        <>
        <div className="page-container">
            <PageSideBar/>
            <div className="parentDiv">
                <div className={"dataResult"}>
                    {qBuilder.map((value) => {
                        return (
                            <>
                            <button onClick={forOnClick} value={value} className={"listOfButtons"} href="#">
                                <p>{value}</p>
                            </button>
                            
                            <br></br>
                            </>
                        );
                    })}
                </div> 
            </div>

        </div>

        </>
    )
}