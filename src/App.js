import './App.css';
import PageHeader from "./components/common-page-components/PageHeader/PageHeader";
import { Route, Routes } from "react-router-dom";
import PageSideBar from "./components/common-page-components/PageSidebar/PageSideBar";
import AllFilesPage from "./components/pages/AllFiles/AllFilesPage";
import CloudSharingManager from "./components/CloudManager/CloudSharingManager";
import React, {useEffect, useState} from "react";
import {gapi} from "gapi-script";
import googleAuth from "./utils/GoogleAuth";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const start = () => {
            gapi.client.init(googleAuth).then()
        }

        gapi.load('client:auth2', start)
    }, [])

    const listFiles = (searchTerm = null) => {
        gapi.client.drive.files
            .list({
                pageSize: 10,
                fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
                q: searchTerm,
            })
            .then(function (response) {
                const res = JSON.parse(response.body);
                console.log(res.files);
            });
    };

    const logInOut = () => {
        setLoggedIn(!loggedIn);
    }

  return (
      <>
          <button onClick={listFiles}>showfile</button>
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
