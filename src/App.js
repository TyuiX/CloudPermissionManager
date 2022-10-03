import './App.css';
import PageHeader from "./components/common-page-components/PageHeader/PageHeader";
import { Route, Routes } from "react-router-dom";
import PageSideBar from "./components/common-page-components/PageSidebar/PageSideBar";
import AllFilesPage from "./components/pages/AllFiles/AllFilesPage";
import CloudSharingManager from "./components/CloudManager/CloudSharingManager";
import React, {useContext, useEffect, useState} from "react";
import {gapi} from "gapi-script";
import googleAuth from "./utils/GoogleAuth";
import {getFiles} from "./api/GoogleAPI";
import {UserContext} from "./utils/context/UserContext";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const { testConnect }  = useContext(UserContext)

    useEffect(() => {
        const start = () => {
            gapi.client.init(googleAuth).then()
        }
        gapi.load('client:auth2', start)
    }, [])

    const logInOut = () => {
        setLoggedIn(!loggedIn);
    }

  return (
      <>
          <button onClick={testConnect}>test</button>
          <button onClick={getFiles}>showfile</button>
          <PageHeader loggedIn={loggedIn} logInOut={logInOut} />
          <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/login" element={<div>Login</div>} />
              <Route path="/login/google" element={<CloudSharingManager />} />
              <Route path="/login/one" element={<div>Login OneDrive</div>} />
              <Route path="/signup" element={<div>Signup</div>} />
              <Route path="/files" element={<AllFilesPage />} />
              <Route path="/myfiles" element={<div>MyFiles</div>} />
              <Route path="/sharedfiles" element={<div>SharedFiles</div>} />
              <Route path="/folder/:folderId" element={<div>OpenFolder</div>} />
              <Route path="/file/:fileId" element={<div>OpenFile</div>} />
              <Route path="/filesnapshot" element={<div>FileSnapshot</div>} />
              <Route path="/groupsnapshot" element={<div>GroupSnapshot</div>} />
          </Routes>
      </>
  );
}

export default App;
