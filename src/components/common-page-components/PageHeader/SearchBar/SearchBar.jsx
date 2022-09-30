import React, {useState} from 'react';

export default function SearchBar(props) {
    const [toggleDropdown, setToggleDropdown] = useState(false);

    const updateSearchText = () => {
        return null;
    }

    return (
        <div className={"search-bar-container"}>
            <input
                type="text"
                onChange={updateSearchText}
                placeholder="Search..."
            />
        </div>
    );
}