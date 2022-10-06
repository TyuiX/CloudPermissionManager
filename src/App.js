import './App.css';
import PageHeader from "./components/common-page-components/PageHeader/PageHeader";
import { Route, Routes } from "react-router-dom";
import MyFiles from "./components/pages/MyFiles/MyFiles";
import CloudSharingManager from "./components/CloudManager/CloudSharingManager";
import React from "react";
import SignUp from "./components/pages/SignUp/SignUp";
import Login from "./components/pages/Login/Login";
import OpenFile from "./components/pages/OpenFile/OpenFile";
import SharedFiles from "./components/pages/SharedFiles/SharedFiles";

function App() {

  return (
      <>
          <PageHeader  />
          <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/google" element={<CloudSharingManager />} />
              <Route path="/login/one" element={<div>Login OneDrive</div>} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/files" element={<MyFiles />} />
              <Route path="/sharedfiles" element={<SharedFiles />} />
              <Route path="/folder/:folderId" element={<div>OpenFolder</div>} />
              <Route path="/file/:fileId" element={<OpenFile />} />
              <Route path="/filesnapshot" element={<div>FileSnapshot</div>} />
              <Route path="/groupsnapshot" element={<div>GroupSnapshot</div>} />
          </Routes>
      </>
  );
}

export default App;
