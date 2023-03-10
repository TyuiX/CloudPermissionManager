import './App.css';
import PageHeader from "./components/common-page-components/PageHeader/PageHeader";
import { Route, Routes } from "react-router-dom";
import MyFiles from "./components/pages/MyFiles/MyFiles";
import MySnapshots from "./components/pages/Snapshot/MySnapshots";
import LinkGoogleLink from "./components/common-page-components/PageSidebar/LinkGoogleLink/LinkGoogleLink";
import React, { useContext } from "react";
import SignUp from "./components/pages/SignUp/SignUp";
import Login from "./components/pages/Login/Login";
import SharedFiles from "./components/pages/SharedFiles/SharedFiles";
import Home from "./components/pages/Home/Home";
import {UserContext} from "./utils/context/UserContext";
import LoadingScreen from "./components/common-page-components/LoadingScreen/LoadingScreen";
import SearchResults from './components/pages/SearchResults/SearchResults';
import GroupSnapshots from "./components/pages/GroupSnapshots/GroupSnapshots";
import ODSnapshots from "./components/pages/ODSnapshot/ODSnapshots";
import SharedDrives from "./components/pages/SharedDrives/SharedDrives";
import OpenSharedDrive from "./components/pages/OpenSharedDrive/OpenSharedDrive";
import LinkOneDriveLink from './components/common-page-components/PageSidebar/LinkOneDriveLink/LinkOneDriveLink';

function App() {
    const {isLoading} = useContext(UserContext)
    console.log(isLoading)

    if (isLoading) {
        return <LoadingScreen />
    }

  return (
      <>
          <PageHeader />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/google" element={<LinkGoogleLink />} />
              <Route path="/login/one" element={<LinkOneDriveLink />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/files" element={<MyFiles isGoogle={true}/>} />
              <Route path="/ODfiles" element={<MyFiles isGoogle={false} />} />
              <Route path="/sharedfiles" element={<SharedFiles isGoogle={true}/>} />
              <Route path="/ODsharedfiles" element={<SharedFiles isGoogle={false}/>} />
              <Route path="/files" element={<MyFiles />} />
              <Route path="/sharedfiles" element={<SharedFiles />} />
              <Route path="/shared/drives" element={<SharedDrives />} />
              <Route path="/shared/drive/:driveId/:driveName" element={<OpenSharedDrive />} />
              <Route path="/filesnapshot" element={<MySnapshots />} />
              <Route path="/ODfilesnapshot" element={<ODSnapshots />} />
              <Route path="/groupsnapshot" element={<GroupSnapshots />} />
              <Route path="/searchresults" element={<SearchResults/>}/>
          </Routes>
      </>
  );
}

export default App;