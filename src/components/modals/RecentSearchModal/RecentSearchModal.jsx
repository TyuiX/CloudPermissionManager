import React, {useContext, useEffect, useState} from 'react';
import "./RecentSearchModal.css";
import {AiOutlineClose} from "react-icons/ai";
import { getSnapshots, getUserProfile } from '../../../api/ShareManagerAPI';

export default function RecentSearchModal(props) {
    const {toggleModal, fileName} = props;
    const [recentSearches, setRecentSearches] = useState(["mus119_paper", "cleanenergycover"]);
    const [snapshots, setSnap] = useState([]);

    useEffect(() => {
        getProfile().then(res => {
            getSnap(res.data.snapshot).then(res2 => {
                setSnap(res2);
            })
        });
    }, []);

    const confirmUpdate = (e) => {
        e.preventDefault();
        toggleModal();
    }

    const getProfile = async () => {
        console.log("here:");
        return await getUserProfile();
    }

    const getSnap = async (msg) => {
        return await getSnapshots(msg);
    }

    return (
        <div className="modal-background">
            <div className="modal-container">
                <div className="modal-header">
                    <span>{fileName}</span>
                    <AiOutlineClose className="sidebar-close-button" onClick={toggleModal} />
                </div>
                <div className="modal-section">
                    <div className="modal-section-title">Recent Searches:</div>
                    <div className="modal-users-list">
                        {recentSearches.length !== 0 ?
                            recentSearches.map((search) => {
                                return (
                                    <div className="modal-user-item">{search}</div>
                                )
                            })
                            :
                            <div className="no-users-message">No recent searches...</div>
                        }
                    </div>
                    {/* <div className="modal-section-title">Snapshots:</div>
                    <div className="modal-users-list">
                        {snapshots.length !== 0 ?
                            snapshots.map((search) => {
                                return (
                                    <div className="modal-user-item">{search}</div>
                                )
                            })
                            :
                            <div className="no-users-message">No snapshots</div>
                        }
                    </div> */}
                </div>
                <div className="modal-footer">
                    <button className="modal-button modal-confirm" onClick={(e) => confirmUpdate(e)}>Confirm</button>
                    <button className="modal-button modal-cancel" onClick={toggleModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
}