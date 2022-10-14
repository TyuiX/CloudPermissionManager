import React, {useContext, useEffect, useRef, useState} from 'react';
import {FaUserCircle} from "react-icons/fa";
import {UserContext} from "../../../../utils/context/UserContext";
import "./ProfileDropdownMenu.css";
import RecentSearchModal from "../../../modals/RecentSearchModal/RecentSearchModal";

export default function ProfileDropdownMenu(props) {
    const [dropdown, setDropdown] = useState(false);
    const {logoutUser} = useContext(UserContext);
    const wrapperRef = useRef(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, false);
        return () => {
            document.removeEventListener("click", handleClickOutside, false);
        };
    }, []);

    const handleToggleModal = () => {
        setShowModal(!showModal)
    }

    const handleClickOutside = event => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setDropdown(false);
        }
    }

    return (
        <>
        <div className="profile-dropdown-container"
             ref={wrapperRef}
        >
            <FaUserCircle
                className="user-profile-button"
                size={30}
                onClick={() => setDropdown(!dropdown)}
            />
            <ul className={`user-dropdown ${dropdown ? "user-dropdown-open" : ""}`}>
                <li className="user-menu-item" onClick={handleToggleModal}>
                    <span>Recent Searches</span>
                </li>
                <li className="user-menu-item" onClick={logoutUser}>
                    <span>Logout</span>
                </li>
            </ul>
        </div>
        {showModal &&
            <RecentSearchModal
                toggleModal={handleToggleModal} setFileName={props.setFileName}
            />
        }
        </>
    );
}