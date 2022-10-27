import React, {useState} from 'react';
import "./ControlReqViolationBlock.css";
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import {MdOutlineError} from "react-icons/md";

export default function ControlReqViolationBlock(props) {
    const {index, violations} = props;
    const [openDropdown, setOpenDropdown] = useState(true);

    return (
        <div className="control-req-violation-container">
            <div className="violation-block-header" onClick={() => setOpenDropdown(!openDropdown)}>
                <span>
                     Access Control Requirement {index} Violations
                </span>
                {openDropdown ?
                    <IoIosArrowUp size={20}/>
                    :
                    <IoIosArrowDown size={20}/>
                }
            </div>
            {
                openDropdown &&
                violations.map(({file, user, role, violation}) => (
                    <div className="violation-info-block">
                        <MdOutlineError className="violations-icon" size={25} />
                        <div className="violation-info-msg">
                            <div>{`In file ${file}, ${user} has role ${role}.`}</div>
                            <div className="violation-subtext">{`Violates policy in ${violation}.`}</div>
                        </div>

                    </div>
                ))
            }
        </div>
    );
}