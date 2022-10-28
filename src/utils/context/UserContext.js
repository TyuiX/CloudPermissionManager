import React, {createContext, useCallback, useEffect, useState} from "react";
import api from '../../api/ShareManagerAPI'
import {useNavigate} from "react-router-dom";
import ControlReqQueriesLists from "../ControlReqQueriesLists";

export const UserContext = createContext({});

function UserContextProvider(props) {
    const [user, setUser] = useState({});
    const [snapshots, setSnapshots] = useState([]);
    const [controlReqs, setControlReqs] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [recentSearches, setRecentSearches] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
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
                setSearchResults(res.data)
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
            console.log(setControlReqs);
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

    const searchCheckFile = (operator, operand, addedFiles, file, addedFilesSet) => {
        // console.log(file);
        if(operator === "drive:drive"){
            if(operand === "My Drive"){
                if(file.ownedByMe === true){
                    if(!addedFilesSet.has(file.name)){
                        addedFilesSet.add(file.name);
                        addedFiles.push(file);
                    }
                }
            } else{
                if(file.ownedByMe === false){
                    if(!addedFilesSet.has(file.name)){
                        addedFilesSet.add(file.name);
                        addedFiles.push(file);
                    }
                }
            }
        } else if(operator === "owner:user"){
            if(file.owner === operand){
                if(!addedFilesSet.has(file.name)){
                    addedFilesSet.add(file.name);
                    addedFiles.push(file);
                }
            }
        } else if(operator === "creator:user"){
            if(file.creator === operand){
                if(!addedFilesSet.has(file.name)){
                    addedFilesSet.add(file.name);
                    addedFiles.push(file);
                }
            }
        } else if(operator === "readable:user"){
            file.permissions.forEach((perm) => {
                if (perm.emailAddress === operand) {
                    if(perm.role === "reader"){
                        if(!addedFilesSet.has(file.name)){
                            addedFilesSet.add(file.name);
                            addedFiles.push(file);
                        }
                    }
                }
            })
        } else if(operator === "writeable:user"){
            file.permissions.forEach((perm) => {
                if (perm.emailAddress === operand) {
                    if(perm.role === "writer"){
                        if(!addedFilesSet.has(file.name)){
                            addedFilesSet.add(file.name);
                            addedFiles.push(file);
                        }
                    }
                }
            })
        } else if(operator === "to:user"){
            console.log("in here");
            file.permissions.forEach((perm) => {
                if (perm.emailAddress === operand) {
                    if(!addedFilesSet.has(file.name)){
                        addedFilesSet.add(file.name);
                        addedFiles.push(file);
                    }
                }
            })
        } else if(operator === "name:regexp"){
            let regexp = new RegExp(operand);
            if(regexp.exec(file.name)){ // key is the regular expression.
                if(!addedFilesSet.has(file.name)){
                    addedFilesSet.add(file.name);
                    addedFiles.push(file);
                }
            }
        }
    }

    const performSearch = useCallback (async (snapshot, queries, save) => {
        let files = [];
        let set = new Set();
        Object.values(snapshot.folders).forEach((folder) => {
            Object.values(folder).forEach((file) => {
                queries.forEach((key, value) => {
                    searchCheckFile(value, key, files, file, set);
                })
            })
        })
        // console.log(files);
        if (save) {
            setSearchResults(files)
        }
        else {
            return files;
        }
    },[])

    const checkInDomains = useCallback ((user, domains) => {
        let found = domains.find(domain => user.endsWith(domain))
        return !!found;
    },[])

    const checkViolations = useCallback((emailAddress, role, fileName, req, violationsList) => {
        console.log(emailAddress)
        console.log(role)
        const {aw, ar, dw, dr, grp} = req;
        console.log(ar)
        let currentViol = {
            file: fileName,
            user: emailAddress,
            role: role,
        }
        if (role === "owner") {
            return;
        }
        if (role === "reader" || role === "commenter") {
            if (dr.emails.length > 0 || dr.domains.length > 0) {
                if (dr.emails.includes(emailAddress) || checkInDomains(emailAddress, dr.domains)) {
                    currentViol.violation = "Denied Reader";
                }
            }
            else if (ar.emails.length > 0 || ar.domains.length > 0) {
                if (!ar.emails.includes(emailAddress) && !checkInDomains(emailAddress, ar.domains)) {
                    currentViol.violation = "Allowed Reader";
                }
            }
        }
        else if (role === "writer" || role === "editor") {
            if (dw.emails.length > 0 || dw.domains.length > 0) {
                if (dw.emails.includes(emailAddress) || checkInDomains(emailAddress, dw.domains)) {
                    currentViol.violation = "Denied Writer";
                }
            }
            else if (aw.emails.length > 0 || aw.domains.length > 0) {
                if (!aw.emails.includes(emailAddress) && !checkInDomains(emailAddress, aw.domains)) {
                    currentViol.violation = "Allowed Writer";
                }
            }
        }
        if (!violationsList.violations.includes(currentViol) && currentViol.hasOwnProperty("violation")) {
            violationsList.violations.push(currentViol)
        }
    },[checkInDomains])

    const getControlReqQueryFiles = useCallback(async (req, snapshot) => {
        let queryMap = new Map();
        const {query} = req;
        let splitQueryOps = query.split(" ");
        splitQueryOps.forEach(query => {
            let queryParts = query.split(":");
            if (queryParts.length <= 1) {
                return
            }
            if (Object.hasOwn(ControlReqQueriesLists.QUERIES_MAP, queryParts[0])) {
                // TODO this is just for while sharing isnt implemented
                if (queryParts[0] === "sharing") {
                    return;
                }
                const [, ...operand] = queryParts
                queryMap.set(ControlReqQueriesLists.QUERIES_MAP[queryParts[0]], operand.join(":"))
            }
        })
        return await performSearch(snapshot, queryMap, false)
    }, [performSearch])

    const checkReqsBeforeUpdate = useCallback(async (filesToUpdate) => {
        console.log(filesToUpdate)
        let violation = false;
        for (const req of controlReqs) {
            console.log(req)
            const index = controlReqs.indexOf(req);
            let currentViolations = {
                index: index + 1,
                violations: [],
            }
            let searchResults = await getControlReqQueryFiles(req, snapshots[0])
            console.log(searchResults)
            let filteredFiles = filesToUpdate.filter(({name}) => searchResults.some((file) => file.name === name))
            console.log(filteredFiles)
            filteredFiles.forEach(({name, updatedUsers, newUsers}) => {
                updatedUsers.forEach(user => {
                    const {email, role} = user;
                    checkViolations(email, role, name, req, currentViolations)
                })
                newUsers.forEach(user => {
                    const {email, role} = user;
                    checkViolations(email, role, name, req, currentViolations)
                })
            })
            if (currentViolations.violations.length > 0) {
                violation = true;
                break;
            }
        }
        return violation
    },[checkViolations, controlReqs, getControlReqQueryFiles, snapshots])

    return (
        <UserContext.Provider value={{
            user, snapshots, isLoading, loggedIn, recentSearches, createUser, loginUser, logoutUser, startLoading, finishLoading, 
            setGoogleAcc, createNewSnapshot, getFolderFileDif, getSnapShotDiff, searchByName, getRecentSearches, createNewControlReq,
            controlReqs, deleteControlReq, setIsLoading, getControlReqs, performSearch, searchResults,
            getControlReqQueryFiles, checkInDomains, checkViolations, checkReqsBeforeUpdate
        }}>
            {props.children}
        </UserContext.Provider>
    );
    
}

export default UserContextProvider;