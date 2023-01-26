import React, {useState} from 'react';
import AnalyzeSharingInfoCell from "./AnalyzeSharingInfoCell/AnalyzeSharingInfoCell";

export default function SnapshotDiffList(props) {
    const {diffInfo} = props

    console.log(diffInfo)

    const [openNewFileDropdown, setOpenNewFileDropdown] = useState(true);
    const [openNewPermDropdown, setOpenNewPermDropdown] = useState(true);
    const [openChangedDropdown, setOpenChangedDropdown] = useState(true);
    const [openDeletedDropdown, setOpenDeletedDropdown] = useState(true);
    
    return (
        <>
            {
                diffInfo["New Files"].length > 0 &&
                <div>
                    <div className="analysis-block-header" onClick={() => setOpenNewFileDropdown(!openNewFileDropdown)}>
                        New Files
                    </div>
                    {openNewFileDropdown &&
                        diffInfo["New Files"].map((info, index) =>
                            <AnalyzeSharingInfoCell key={index} cellInfo={info} />
                        )
                    }
                </div>
            }
            {
                diffInfo["New Permissions"].length > 0 &&
                <div>
                    <div className="analysis-block-header" onClick={() => setOpenNewPermDropdown(!openNewPermDropdown)}>
                        New Permissions
                    </div>
                    {openNewPermDropdown &&
                        diffInfo["New Permissions"].map((info, index) =>
                            <AnalyzeSharingInfoCell key={index} cellInfo={info} />
                        )
                    }
                </div>
            }
            {
                diffInfo["Changed Permissions"].length > 0 &&
                <div>
                    <div className="analysis-block-header" onClick={() => setOpenChangedDropdown(!openChangedDropdown)}>
                        Changed Permissions
                    </div>
                    {openChangedDropdown &&
                        diffInfo["Changed Permissions"].map((info, index) =>
                            <AnalyzeSharingInfoCell key={index} cellInfo={info} />
                        )
                    }
                </div>
            }
            {
                diffInfo["Deleted Permissions"].length > 0 &&
                <div>
                    <div className="analysis-block-header" onClick={() => setOpenDeletedDropdown(!openDeletedDropdown)}>
                        Deleted Permissions
                    </div>
                    {openDeletedDropdown &&
                        diffInfo["Deleted Permissions"].map((info, index) =>
                            <AnalyzeSharingInfoCell key={index} cellInfo={info} />
                        )
                    }
                </div>
            }
        </>
    );
}