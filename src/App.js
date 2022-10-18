import './App.css';
import PageHeader from "./components/common-page-components/PageHeader/PageHeader";
import {PageLayout} from "./components/pages/OneDriveAuth/PageLayout";
import { Route, Routes } from "react-router-dom";
import MyFiles from "./components/pages/MyFiles/MyFiles";
import MySnapshots from "./components/pages/Snapshot/MySnapshots";
import LinkGoogleLink from "./components/common-page-components/PageSidebar/LinkGoogleLink/LinkGoogleLink";
import React, {useContext, useState, useEffect} from "react";
import SignUp from "./components/pages/SignUp/SignUp";
import Login from "./components/pages/Login/Login";
import SharedFiles from "./components/pages/SharedFiles/SharedFiles";
import Home from "./components/pages/Home/Home";
import * as event from "./components/functions/events"
import {UserContext} from "./utils/context/UserContext";
import LoadingScreen from "./components/common-page-components/LoadingScreen/LoadingScreen";
import { getSnapshots, getUserProfile } from './api/ShareManagerAPI';
import SearchResults from "/Users/emirhanakkaya/cse416-frontend/src/components/pages/SearchResults/SearchResults.jsx";
import QueryBuilder from './components/pages/QueryBuilder/QueryBuilder';

function App() {
    const {isLoading} = useContext(UserContext)
    console.log(isLoading)

    const [snapshots, setSnap] = useState([]);

    const getProfile = async () => {
        let user = localStorage.getItem('user');
        const parsedUser = JSON.parse(user)
        console.log(parsedUser);
        return await getUserProfile({email: parsedUser.email});
    }

    const getSnap = async (msg) => {
        return await getSnapshots(msg);
    }

    useEffect(() => {
        getProfile().then(res => {
            getSnap(res.data.snapshot).then(res2 => {
                setSnap(res2);
            })
        });
        // event.handleGetFile();
        console.log("in use effect");
        console.log(snapshots);
    }, []);

    console.log(snapshots)
    if (isLoading) {
        return <LoadingScreen />
    }

  return (
      <>
          <PageHeader snapshots={snapshots} />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/google" element={<LinkGoogleLink />} />
              <Route path="/login/one" element={<PageLayout />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/files" element={<MyFiles />} />
              <Route path="/sharedfiles" element={<SharedFiles />} />
              <Route path="/folder/:folderId" element={<div>OpenFolder</div>} />
              {/* <Route path="/filesnapshot" element={<div >FileSnapshot <button onClick={event.handleGetFile}>click me </button></div>} /> */}
              <Route path="/filesnapshot" element={<MySnapshots newSnap={event.handleGetFile} snapshot={snapshots}/>} />
              <Route path="/groupsnapshot" element={<div>GroupSnapshot</div>} />
              <Route path="/searchresults" element={<SearchResults/>}/>
              <Route path="/querybuilder" element={<QueryBuilder/>}/>
          </Routes>
      </>
  );
}

export default App;