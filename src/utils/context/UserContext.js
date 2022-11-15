import React, {createContext, useCallback, useEffect, useState} from "react";
import api from '../../api/ShareManagerAPI'
import {UNSAFE_enhanceManualRouteObjects, useNavigate} from "react-router-dom";
import ControlReqQueriesLists from "../ControlReqQueriesLists";
import controlReqsList from "../ControlReqQueriesLists";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { Stack } from "react-bootstrap";

export const UserContext = createContext({});

function UserContextProvider(props) {
    const [user, setUser] = useState({});
    const [snapshots, setSnapshots] = useState([]);
    const [controlReqs, setControlReqs] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [recentSearches, setRecentSearches] = useState([]);
    const [searchResults, setSearchResults] = useState({});
    const [groupSnapshots, setGroupSnapshots] = useState([])
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
            await Promise.all([getSnapshots(), getRecentSearches(), getControlReqs(), getGroupSnapshots()])
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

    const getDeviantFiles = useCallback( async (snapshot) => {
        try {
            const res = await api.deviant({snapshot: snapshot})
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

    const searchByName = useCallback( async (id, searchText) => {
        try{
            const res = await api.searchByName({name: searchText, id: id, email: user.email});
            if (res.status === 200) {
                console.log(res.data)
                setSearchResults({results: res.data, snapshot: id})
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


    const getGroupSnapshots = useCallback(async () => {
        try {
            const res = await api.getUserProfile({email: user.email});
            console.log(res.data)
            const res2 = await api.getGroupSnapshots(res.data.groupSnapshot)
            setGroupSnapshots(res2.data.snaps)
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    },[user.email])

    const createNewGroupSnapshot = useCallback(async (members, grpEmail) => {
        try {
            const res = await api.createNewGroupSnapshot({members: members, grpEmail: grpEmail, email: user.email})
            console.log(res.data)
            await getGroupSnapshots()
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    }, [user.email])

    const searchCheckFile = (operator, operand, filePassed, addedFilesSet, snapshot, folderId) => {

        let filesAdded = null; // update this "dummy" array and then return this as the return for "searchCheckFiles"
        console.log(operator);
        console.log(operand);
        if(operator === "drive"){
            if(operand === "MyDrive"){
                console.log(filePassed);
                if(filePassed.ownedByMe === true){
                    filesAdded = filePassed;
                }
            } else{
                if(filePassed.ownedByMe === false){
                    filesAdded = filePassed;
                }
            }
        } else if(operator === "owner"){
            console.log(filePassed)
            if(filePassed.owner === operand){
                filesAdded = filePassed;
            }
        } else if(operator === "creator"){
            if(filePassed.creator === operand){
                filesAdded = filePassed;
            }
        } else if(operator === "readable"){
            filePassed.permissions.forEach((perm) => {
                if (perm.emailAddress === operand) {
                    if(perm.role === "reader"){
                        filesAdded = filePassed;
                    }
                }
            })
        } else if(operator === "writeable"){
            filePassed.permissions.forEach((perm) => {
                if (perm.emailAddress === operand) {
                    if(perm.role === "writer"){
                        filesAdded = filePassed;
                    }
                }
            })
        } else if(operator === "shareable"){
            console.log(filePassed);
            if(filePassed.owner === operand){
                filesAdded = filePassed;
            }
        }else if(operator === "to"){
            console.log("in here");
            filePassed.permissions.forEach((perm) => {
                if (perm.emailAddress === operand) { // "ownedByMe" doesn't need to be true here.
                    if(perm.role !== "owner"){
                        filesAdded = filePassed;
                    }
                }
            })
        } else if(operator === "from"){
            filePassed.permissions.forEach((perm) => {
                if (perm.emailAddress === operand) {
                    if(perm.role === "owner"){
                        filesAdded = filePassed;
                    }
                }
            })
        } else if(operator === "name"){ // sharing:name
            let regexp = new RegExp(operand);
            console.log(filePassed);
            if(regexp.exec(filePassed.name)){ // key is the regular expression.
                filesAdded = filePassed;
            }
        } else if(operator === "none"){ // sharing:none
            if(filePassed.ownedByMe === true && filePassed.permissions.length === 1){
                console.log("owned By me");
                filesAdded = filePassed;
            }
        } else if(operator === "domain"){ // sharing:domain
            /*
                * doesn't accept a "value" since the sharing:domain automatically goes into
                * the email of the current logged into google drive
            */
            let ownerDomain = "" + filePassed.owner;
            ownerDomain = ownerDomain.substring(ownerDomain.indexOf("@") + 1);
            
            if(filePassed.ownedByMe === true){
                filePassed.permissions.forEach((perm) => {
                    let userDomain = "" + perm.emailAddress;
                    userDomain = userDomain.substring(userDomain.indexOf("@") + 1);
                    if(perm.role !== "owner"){
                        if (userDomain === ownerDomain && filePassed.permissions.length !== 1) {
                            filesAdded = filePassed;
                        }
                    }
                })
            }
    // working:
    // -sharing:none and -writeable:brandon.stillword@gemini.com and -name:cse114_m1review or to:varunvinay.chotalia@stonybrook.edu 
    // -sharing:none and -writeable:brandon.stillword@gemini.com and name:cse114_m1review or to:varunvinay.chotalia@stonybrook.edu
        }else if(operator === "individual"){
            console.log("in here");
            filePassed.permissions.forEach((perm) => {
                if(filePassed.ownedByMe){
                    if (perm.emailAddress === operand) {
                        if(perm.role === "writer" || perm.role === "reader"){
                            filesAdded = filePassed;
                        }
                    }
                }
            })
        } else if(operator === "inFolder"){
            console.log(snapshot);
            console.log(folderId);
            Object.entries(snapshot.folders).forEach((key, value) => {
                if(key[0] === folderId){
                    let index = 0;
                    while(index < (Object.values(key[1]).length)){
                        console.log(filesAdded);
                        filesAdded = filePassed;
                        index += 1;
                    }
                }
            })
        } else if(operator === "folder"){
            Object.entries(snapshot.folders).forEach((key, value) => {
                if(key[0] === folderId){
                    let index = 0;
                    console.log(snapshot);
                    console.log(folderId);
                    console.log(filePassed);
                    while(index < (Object.values(key[1]).length)){
                        let file = Object.values(key[1])[index];
                        filesAdded = filePassed;
                        checkForSubFolders(snapshot, file.id, addedFilesSet);  // addedFiles was here.
                        index += 1;
                    }
                }
            })
        }
        return filesAdded;
    }

    /**
     * helper function for "folder:regexp" query operator. This function checks to see if there
     * exists a sub folder which has files in it, that needs to be shown for the front end.
    */
    const checkForSubFolders = (snapshot, folderId, addedFiles) => {
        Object.entries(snapshot.folders).forEach((key, value) => {
            console.log(folderId);
            if(key[0] === folderId){
                let index = 0;
                while(index < (Object.values(key[1]).length)){
                    let file = Object.values(key[1])[index];
                    console.log(file);
                    
                    addedFiles.push(file);
                    console.log(addedFiles);
                    checkForSubFolders(snapshot, file.id, addedFiles);
                    index += 1;
                }
            }
        })
        console.log(addedFiles);
        return addedFiles;
    }

    const searchFolder = (operator, snapshot, folderId) => {
        let toAdd = [];
        console.log(operator);
        if(operator === "inFolder"){
            Object.entries(snapshot.folders).forEach((key, value) => {
                if(key[0] === folderId){
                    let index = 0;
                    while(index < (Object.values(key[1]).length)){
                        toAdd.push(Object.values(key[1])[index]);
                        index += 1;
                    }
                }
            })
        } else if(operator === "folder"){
            Object.entries(snapshot.folders).forEach((key, value) => {
                if(key[0] === folderId){
                    let index = 0;
                    while(index < (Object.values(key[1]).length)){
                        let file = Object.values(key[1])[index];
                        toAdd = checkForSubFolders(snapshot, file.id, toAdd);
                        console.log(toAdd);
                        index += 1;
                    }
                }
            })
        }
        console.log(toAdd);
        return toAdd;
    }

    const performSearch = useCallback (async (snapshot, queries, save, booleanOps) => {
        
        let set = new Set();
        let results = []; 
        let index = 0;

        await api.addRecentSearch({
            query: queries.join(" "),
            email: user.email
        })

        // TODO redundant code
        // if(queries[0].display){
        //     while(index < queries.length){
        //         let temp = queries[index].display;
        //         queries[index] = temp;
        //         index += 1;
        //     }
        // }
        
        index = 0;
        while(index < queries.length){
            let tempResult = [];
            let tempResultIndex = 0;
            let value = queries[index].substring(0, queries[index].indexOf(":"));
            let vFlag = 0;
            if(value[0] === "-"){
                value = value.substring(1);
                vFlag = 1;
            }

            let key = queries[index].substring(queries[index].indexOf(":") + 1);

            if(key === "none"){
                value = "none";
            } else if(key === "domain"){
                value = "domain";
            } else if(value === "sharing"){
                value = "individual"
            }

            console.log("value: " + value + ", key: " + key);
            
            if(index % 2 === 0){ // non boolean operator
                Object.values(snapshot.folders).forEach((folder) => {
                    Object.values(folder).forEach((file) => {
                        if(value === "inFolder"){
                            let regexp = new RegExp(key);
                            if(regexp.exec(file.name) && file.type === "folder"){ 
                                tempResult = searchFolder(value, snapshot, file.id);
                            }
                        } else if(value === "folder"){
                            let regexp = new RegExp(key);
                            if(regexp.exec(file.name) && file.type === "folder"){ 
                                tempResult = searchFolder(value, snapshot, file.id);
                            }
                        } else{
                            let resultHere = searchCheckFile(value, key, file, set, snapshot, "");
                            console.log(resultHere);
                            if(resultHere){ tempResult[tempResultIndex++] = resultHere; }
                        }
                    })
                })

                console.log("vFlag: " + vFlag);
                // check all files for a possible "-" in front of their file names.
                if(vFlag){ // then iterate through all files and only pick the one's that are not in current
                    // temp results array.
                    let indexHere = 0;
                    let setHere = new Set(); // don't add duplicate files from below:
                    while(indexHere < tempResult.length){
                        setHere.add(tempResult[indexHere++].id);
                    }
                    let tempIndex = 0;
                    tempResult = [];
                    Object.values(snapshot.folders).forEach((folder) => {
                        Object.values(folder).forEach((file) => {
                            if(!setHere.has(file.id)){
                                tempResult[tempIndex++] = file;
                            }
                        })
                    })
                }

                if(index === 0) { results = tempResult; }
                else{
                    // apply boolean operator.
                    if(queries[index-1] === "and"){
                        let setOfParentFiles = new Set();
                        let indexHere = 0;
                        while(indexHere < results.length){
                            setOfParentFiles.add(results[indexHere++].id);
                        }

                        indexHere = 0;
                        let andResults = [];
                        let andResultsIndex = 0;
                        while(indexHere < tempResult.length){
                            if(setOfParentFiles.has(tempResult[indexHere].id)){
                                andResults[andResultsIndex++] = tempResult[indexHere]; // add this file to it.
                            }
                            indexHere += 1;
                        }

                        results = andResults;
                    } else if(queries[index-1] === "or"){
                        let orResults = [];
                        let setHere = new Set(); // don't add duplicate files from below:
                        let orResultsIndex = 0;
                        while(orResultsIndex < results.length){
                            orResults[orResultsIndex] = results[orResultsIndex]; // add this file to it.
                            setHere.add(results[orResultsIndex]);
                            orResultsIndex += 1;
                        }
                        
                        let indexHere = 0;
                        while(indexHere < tempResult.length){
                            if(!setHere.has(tempResult[indexHere])){
                                orResults[orResultsIndex] = tempResult[indexHere]; // add this file to it.
                                orResultsIndex += 1;
                            }
                            indexHere += 1;
                        }
                        results = orResults;
                    }
                }
            }
            index += 1;
        }
        //name:pdf$ and owner:emirhan.akkaya@stonybrook.edu or writeable:varunvinay.chotalia@stonybrook.edu
        if (save) {
            setSearchResults({results: results, snapshot: snapshot._id})
        }
        else {
            return results;
        }
    },[searchCheckFile, searchFolder, user.email])

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
        const {query} = req;
        return await performSearch(snapshot, query.split(" "), false, [])
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
            controlReqs, deleteControlReq, setIsLoading, performSearch, searchResults, groupSnapshots, createNewGroupSnapshot,
            getControlReqQueryFiles, checkInDomains, checkViolations, checkReqsBeforeUpdate, getDeviantFiles
        }}>
            {props.children}
        </UserContext.Provider>
    );
    
}

export default UserContextProvider;