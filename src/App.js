import './App.css';
import PageHeader from "./components/common-page-components/PageHeader/PageHeader";
import { Route, Routes } from "react-router-dom";
import AllFiles from "./components/pages/AllFiles/AllFiles";
import CloudSharingManager from "./components/CloudManager/CloudSharingManager";
import React, {useContext, useEffect, useState} from "react";
import { gapi } from "gapi-script";
import googleAuth from "./utils/GoogleAuth";
import {getFiles} from "./api/GoogleAPI";
import {getPermissionsStart} from "./api/GoogleAPI"
import {updatePermissionsStart} from "./api/GoogleAPI"
import {addPermissionForUser} from "./api/GoogleAPI"
import SignUp from "./components/pages/SignUp/SignUp";
import Login from "./components/pages/Login/Login";
import OpenFile from "./components/pages/File/OpenFile";
import {GoogleContext} from "./utils/context/GoogleContext";

function App() {
    const { files } = useContext(GoogleContext)

  return (
      <>
          <PageHeader  />
          <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/google" element={<CloudSharingManager />} />
              <Route path="/login/one" element={<div>Login OneDrive</div>} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/files" element={<AllFiles files={files}/>} />
              <Route path="/myfiles" element={<div>MyFiles</div>} />
              <Route path="/sharedfiles" element={<div>SharedFiles</div>} />
              <Route path="/folder/:folderId" element={<div>OpenFolder</div>} />
              <Route path="/file/:fileId" element={<OpenFile />} />
              <Route path="/filesnapshot" element={<div>FileSnapshot</div>} />
              <Route path="/groupsnapshot" element={<div>GroupSnapshot</div>} />
          </Routes>
      </>
  );
}

export default App;
