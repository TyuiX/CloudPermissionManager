import React, {useState} from 'react';
import AnalyzeSharingInfoCell from "../AnalyzeSharingInfoCell/AnalyzeSharingInfoCell";

export default function FileFolderSharingDiffList(props) {
    const {diffInfo} = props
    const [openDiffDropdown, setOpenDiffDropdown] = useState(true);
    const [openExtrDropdown, setOpenExtrDropdown] = useState(true);
    const [openMissDropdown, setOpenMissDropdown] = useState(true);

    return (
        <>
            {
                diffInfo["Different Permissions"].length > 0 &&
                <div>
                    <div className="analysis-block-header" onClick={() => setOpenDiffDropdown(!openDiffDropdown)}>
                        Different Permissions
                    </div>
                    {openDiffDropdown &&
                        diffInfo["Different Permissions"].map((info, index) =>
                            <AnalyzeSharingInfoCell key={index} cellInfo={info} infoType={"ff"} />
                        )
                    }
                </div>
            }
            {
                diffInfo["Missing Permissions"].length > 0 &&
                <div>
                    <div className="analysis-block-header" onClick={() => setOpenMissDropdown(!openMissDropdown)}>
                        Missing Permissions
                    </div>
                    {openMissDropdown &&
                        diffInfo["Missing Permissions"].map((info, index) =>
                            <AnalyzeSharingInfoCell key={index} cellInfo={info} infoType={"ff"} />
                        )
                    }
                </div>
            }
            {
                diffInfo["Extra Permissions"].length > 0 &&
                <div>
                    <div className="analysis-block-header" onClick={() => setOpenExtrDropdown(!openExtrDropdown)}>
                        Extra Permissions
                    </div>
                    {openExtrDropdown &&
                        diffInfo["Extra Permissions"].map((info, index) =>
                            <AnalyzeSharingInfoCell key={index} cellInfo={info} infoType={"ff"} />
                        )
                    }
                </div>
            }
        </>
    );
}