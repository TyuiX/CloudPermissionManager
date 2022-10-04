import React, {useContext, useEffect, useRef, useState} from 'react';
import {FaUserCircle} from "react-icons/fa";
import {UserContext} from "../../../../utils/context/UserContext";
import "./ProfileDropdownMenu.css";

export default function ProfileDropdownMenu() {
    const [dropdown, setDropdown] = useState(false);
    const {logoutUser} = useContext(UserContext)
    const wrapperRef = useRef(null);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, false);
        return () => {
            document.removeEventListener("click", handleClickOutside, false);
        };
    }, []);

    const handleClickOutside = event => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setDropdown(false);
        }
    }

    return (
        <div className="profile-dropdown-container"
             ref={wrapperRef}
        >
            <FaUserCircle
                className="user-profile-button"
                size={30}
                onClick={() => setDropdown(!dropdown)}
            />
            <ul className={`user-dropdown ${dropdown ? "user-dropdown-open" : ""}`}>
                <li className="user-menu-item">
                    <span onClick={logoutUser}>Logout</span>
                </li>
            </ul>
        </div>
    );
}