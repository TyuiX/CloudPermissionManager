import React, {useState} from 'react';
import drives from "../../../../utils/CloudDrives";
import "./FileInfoBlock.css";
import PermissionsCell from "../PermissionsCell/PermissionsCell";
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";

export default function FileInfoBlock(props) {
    const {fileInfo} = props;
    const {name, cloudOrigin, type, permissions} = fileInfo;
    const [openDropdown, setOpenDropdown] = useState(true);

    return fileInfo && (
        <div className="file-info-block">
            <div className="file-info-name"
                 onClick={() => setOpenDropdown(!openDropdown)}
            >
                <span>{name}</span>
                {openDropdown ?
                    <IoIosArrowUp size={20}/>
                    :
                    <IoIosArrowDown size={20}/>
                }
            </div>
            {
                openDropdown &&
                <>
                    <div>
                        <div className="file-info-key">Origin</div>
                        <span className="file-info-value">{drives[cloudOrigin].name}</span>
                    </div>
                    <div>
                        <span className="file-info-key">Type</span>
                        <span className="file-info-value">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </div>
                    <div className="files-permissions-list">
                        {permissions ?
                            <>
                                <div className="file-info-key perms-header">Permissions </div>
                                {
                                    //TODO redo later to account for groups
                                    permissions.filter(({type}) => type === "user").map((perm) => (
                                        <PermissionsCell key={perm.id} permInfo={perm} />
                                    ))
                                }
                            </>
                            :
                            <div>
                                <div className="file-info-key">Permissions </div>
                                Unavailable
                            </div>
                        }
                    </div>
                </>
            }
        </div>
    );
}