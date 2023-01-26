import React from 'react';
import "./Home.css";
import {AiOutlineCloudSync} from "react-icons/ai";

export default function Home() {
    return (
        <div className="home-background">
            <AiOutlineCloudSync size={270} />
            <h1 className="home-title">Cloud Sharing Manager</h1>
            <p className="home-desc">Our online cloud drive sharing management solution.</p>
        </div>
    );
}