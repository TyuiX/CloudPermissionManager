import React from 'react';
import "./LoadingScreen.css";
import {AiOutlineCloudSync, AiOutlineLoading, AiOutlineLoading3Quarters} from "react-icons/ai";

export default function LoadingScreen() {
    return (
        <div className="loading-screen-background">
            <div className="loading-screen-header">
                <AiOutlineCloudSync size={40} />
                <span>Cloud Sharing Manager</span>
            </div>
            <div className="spinner-container">
                <AiOutlineLoading3Quarters size={140} className="loading-spinner spin-1" />
                <AiOutlineLoading size={140} className="loading-spinner spin-2" />
                <AiOutlineLoading size={140} className="loading-spinner spin-3" />
                <div className="loading-msg">Loading...</div>
            </div>
        </div>
    );
}