import './App.css';
import PageHeader from "./components/common-page-components/PageHeader/PageHeader";
import { Route, Routes } from "react-router-dom";
import MyFiles from "./components/pages/MyFiles/MyFiles";
import {PageLayout} from "./components/onedriveauth/PageLayout";
import LinkGoogleLink from "./components/common-page-components/PageSidebar/LinkGoogleLink/LinkGoogleLink";
import React, {useContext} from "react";
import SignUp from "./components/pages/SignUp/SignUp";
import Login from "./components/pages/Login/Login";
import SharedFiles from "./components/pages/SharedFiles/SharedFiles";
import Home from "./components/pages/Home/Home";
import * as event from "./components/functions/events"
import {UserContext} from "./utils/context/UserContext";
import LoadingScreen from "./components/common-page-components/LoadingScreen/LoadingScreen";

function App() {
    const {isLoading} = useContext(UserContext)
    console.log(isLoading)

    if (isLoading) {
        return <LoadingScreen />
    }

  return (
      <>
          <PageHeader  />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/one" element={<PageLayout />} />
              <Route path="/login/google" element={<LinkGoogleLink />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/files" element={<MyFiles />} />
              <Route path="/sharedfiles" element={<SharedFiles />} />
              <Route path="/folder/:folderId" element={<div>OpenFolder</div>} />
              <Route path="/filesnapshot" element={<div >FileSnapshot <button onClick={event.handleGetFile}>click me </button></div>} />
              <Route path="/groupsnapshot" element={<div>GroupSnapshot</div>} />
          </Routes>
      </>
  );
}

export default App;
