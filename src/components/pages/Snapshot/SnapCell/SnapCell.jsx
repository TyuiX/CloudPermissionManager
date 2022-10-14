import React from 'react';

export default function FileCell(props) {
    const {snapInfo} = props;
    let date = snapInfo.date + "";

    let month = date.substring(5, 7);
    let day = date.substring(8, 10);
    let time = date.substring(11, date.length - 5);


    let monthString = "";
    if(month === "10") { monthString = "October"}
    else if(month === "11") { monthString = "November"}
    else if(month === "12") { monthString = "December"}
    let fullDate = "Taken on " + monthString + " " + day + ", " + 2022 + " at " + time;

    return (
        <div>
            <p className="page-content-all-the-way">id: {snapInfo._id} <br></br> {fullDate}</p>
        </div>
    );
}