import React, {useState} from 'react';
import drives from "../../../../utils/CloudDrives";
import "./FileInfoBlock.css";
import PermissionsCell from "../PermissionsCell/PermissionsCell";
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import UpdateSingleSharingModal from "../../../modals/UpdateSingleSharingModal/UpdateSingleSharingModal";

export default function FileInfoBlock(props) {
    const {fileInfo, shared, closeInfo, isGoogle} = props;
    const {name, cloudOrigin, type, permissions, id} = fileInfo;
    const [openDropdown, setOpenDropdown] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const handleToggleModal = () => {
        setShowModal(!showModal)
    }

    return fileInfo && (
        <>
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
                        {!shared &&
                            <div className="update-access-button-container">
                                <button className="update-access-button" onClick={handleToggleModal}>Update Access</button>
                            </div>
                        }
                        <div>
                            <div className="file-info-key">Origin</div>
                            <span className="file-info-value">{drives[isGoogle?cloudOrigin:"one"].name}</span>
                        </div>
                        <div>
                            <span className="file-info-key">Type</span>
                            <span className="file-info-value">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        </div>
                        <div className="files-permissions-list">
                            {permissions && isGoogle?
                                <>
                                    <div className="file-info-key perms-header">Permissions </div>
                                    {
                                        permissions.map((perm) => (
                                            <PermissionsCell key={perm.id} permInfo={perm}/>
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
            {showModal &&
                <UpdateSingleSharingModal
                    existingPerms={permissions}
                    fileId={id}
                    fileName={name}
                    origin={cloudOrigin}
                    toggleModal={handleToggleModal}
                    closeInfo={closeInfo}
                />
            }
        </>
    );
}