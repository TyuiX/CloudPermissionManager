import React, {createContext, useCallback, useEffect, useState} from "react";
import api from '../../api/ShareManagerAPI'
import {useNavigate} from "react-router-dom";

export const UserContext = createContext({});

function UserContextProvider(props) {
    const [user, setUser] = useState({});
    const [snapshots, setSnapshots] = useState([]);
    const [controlReqs, setControlReqs] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [recentSearches, setRecentSearches] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
            setLoggedIn(true)
            navigate("/files")
        }
        else {
            navigate("/")
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!user.email) {
            return
        }
        const loadResources = async () => {
            await getSnapshots()
            await getRecentSearches()
            await getControlReqs()
        }
        loadResources()
    }, [user.email])
    
    
    const startLoading = useCallback(() => {
        setIsLoading(true);
    }, [])
    
    const finishLoading = useCallback(() => {
        setIsLoading(false);
    }, [])

    const createUser = useCallback(async (userInfo) => {
        try {
            const res = await api.createUser(userInfo);
            if (res.status === 200) {
                // set the state of the user
                setUser(res.data.user);
                setLoggedIn(true);
                // store the user in localStorage
                localStorage.setItem('user', JSON.stringify(res.data.user))
            }
            return navigate("/files");
        }
        catch (err) {
            console.log(err)
            return err.response.data.errorMessage;
        }
    }, [setUser, setLoggedIn, navigate])

    const loginUser = useCallback(async (loginInfo) => {
        try {
            const res = await api.loginUser(loginInfo);
            if (res.status === 200) {
                // set the state of the user
                setUser(res.data.user);
                setLoggedIn(true);
                // store the user in localStorage
                localStorage.setItem('user', JSON.stringify(res.data.user))
            }
            return navigate("/files");
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    }, [setUser, setLoggedIn, navigate]);

    const logoutUser = useCallback( async () => {
        setUser({});
        setLoggedIn(false);
        localStorage.clear();
        return navigate("/");
    }, [setUser, setLoggedIn, navigate])

    const setGoogleAcc = useCallback( async (accEmail, googleEmail) => {
        try {
            const res = await api.setLinkedGoogle({email: accEmail, googleId: googleEmail});
            if (res.status === 200) {
                // set the state of the user
                setUser(res.data.user);
                // store the user in localStorage
                localStorage.setItem('user', JSON.stringify(res.data.user))
            }
            return navigate("/files");
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    }, [navigate])
    
    const getSnapshots = useCallback( async () => {
        try {
            const res = await api.getUserProfile({email: user.email});
            console.log(res.data)
            const res2 = await api.getSnapshots(res.data.snapshot)
            // if (res2.status === 200) {
                setSnapshots(res2.data)
            // }
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    },[user.email])

    const createNewSnapshot = useCallback( async (snapshot, email) => {
        try {
            const res = await api.createSnapshot({snapshot: snapshot, email: email})
            if (res.status === 200) {
                await getSnapshots()
            }
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    }, [getSnapshots])

    const getFolderFileDif = useCallback( async (id) => {
        try {
            const res = await api.getFileFolderDif(id)
            if (res.status === 200) {
                console.log(res.data)
                return res.data
            }
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    }, [])

    const getSnapShotDiff = useCallback( async (oldSnapshot, currSnapshot) => {
        try {
            const res = await api.snapshotDiff({oldSnapshot: oldSnapshot, currSnapshot: currSnapshot});
            if (res.status === 200) {
                // set the state of the user
                console.log(res.data)
                return res.data
            }
        }
        catch(err){
            return err.response.data.errorMessage;
        }
    }, [])

    const searchByName = useCallback( async (id, fileName) => {
        try{
            const res = await api.searchByName({name: fileName, id: id, email: user.email});
            if (res.status === 200) {
                console.log(res.data)
                return res.data
            }
        }
        catch(err){
            return err.response.data.errorMessage;
        }
    }, [user.email])

    const getRecentSearches = useCallback(async () => {
        try {
            const res = await api.getUserProfile({email: user.email});
            console.log(res.data)
            setRecentSearches(res.data.recentSearches)
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    }, [user.email])
    
    const getControlReqs = useCallback(async () => {
        try {
            const res = await api.getUserProfile({email: user.email});
            const res2 = await api.getControlReqs(res.data.accessControlReqs)
            setControlReqs(res2.data.reqs)
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    },[user.email])

    const deleteControlReq = useCallback(async (id) => {
        try {
            console.log(user.email)
            await api.deleteControlReq({id: id, email: user.email});
            await getControlReqs()
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    },[user.email])

    const createNewControlReq = useCallback(async (newControlReq) => {
        try {
            const res = await api.createNewControlReqs({newReq: newControlReq, email: user.email})
            console.log(res.data)
            await getControlReqs()
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    }, [user.email])

    return (
        <UserContext.Provider value={{
            user, snapshots, isLoading, loggedIn, recentSearches, createUser, loginUser, logoutUser, startLoading, finishLoading, 
            setGoogleAcc, createNewSnapshot, getFolderFileDif, getSnapShotDiff, searchByName, getRecentSearches, createNewControlReq,
            controlReqs, deleteControlReq, setIsLoading, getControlReqs
        }}>
            {props.children}
        </UserContext.Provider>
    );
    
}

export default UserContextProvider;