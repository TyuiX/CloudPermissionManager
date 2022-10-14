import React from 'react';

export default function FileCell(props) {
    const {snapInfo} = props;
    return (
        <div>  
            <p className="page-content-all-the-way">id: {snapInfo._id} <br></br> date: {snapInfo.date}</p>
        </div>
    );
}