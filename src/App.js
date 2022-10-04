import './App.css';
import PageHeader from "./components/common-page-components/PageHeader/PageHeader";
import { Route, Routes } from "react-router-dom";
import AllFilesPage from "./components/pages/AllFiles/AllFilesPage";
import CloudSharingManager from "./components/CloudManager/CloudSharingManager";
import React, { useEffect } from "react";
import { gapi } from "gapi-script";
import googleAuth from "./utils/GoogleAuth";
import {getFiles} from "./api/GoogleAPI";
import {getPermissionsStart} from "./api/GoogleAPI"
import {updatePermissionsStart} from "./api/GoogleAPI"
import {addPermissionForUser} from "./api/GoogleAPI"
import SignUp from "./components/pages/SignUp/SignUp";
import Login from "./components/pages/Login/Login";

function App() {

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
          <button onClick={getFiles}>showfile</button>
          <button onClick={() => getPermissionsStart("15fPh_-XK41GV2Kul1_m6OXXRCsaBU9fECuA1yAfXLzw")}>showPerm</button>
          <button onClick={() => updatePermissionsStart("15fPh_-XK41GV2Kul1_m6OXXRCsaBU9fECuA1yAfXLzw", "13084050885625841573")}>upatePerm</button>
          <button onClick={() => addPermissionForUser("1xxxJyk8BFeM7rsY4w_kZE-xa0olPAGihgsoHQ0mOeRo")}>upatePerm</button>
          <PageHeader loggedIn={loggedIn} logInOut={logInOut} />
          <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/google" element={<CloudSharingManager />} />
              <Route path="/login/one" element={<div>Login OneDrive</div>} />
              <Route path="/signup" element={<SignUp />} />
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
