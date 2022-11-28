import React, {createContext, useCallback, useEffect, useState} from "react";
import api from '../../api/ShareManagerAPI'
import {useNavigate} from "react-router-dom";
import ControlReqQueriesLists from "../ControlReqQueriesLists";
import controlReqsList from "../ControlReqQueriesLists";
import { Stack } from "react-bootstrap";
import { queryByTestId } from "@testing-library/react";
import { useMsal } from "@azure/msal-react";

export const UserContext = createContext({});

function UserContextProvider(props) {
    const [user, setUser] = useState({});
    const [snapshots, setSnapshots] = useState([]);
    const [oneDriveSnapshots, setOneDriveSnapshots] = useState([]);
    const [controlReqs, setControlReqs] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [recentSearches, setRecentSearches] = useState([]);
    const [searchResults, setSearchResults] = useState({});
    const [groupSnapshots, setGroupSnapshots] = useState([])

    const navigate = useNavigate();

    // check if user is already logged in
    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            console.log(foundUser)
            setUser(foundUser);
            setLoggedIn(true)
            navigate("/files")
        }
        else {
            navigate("/")
        }
        setIsLoading(false);
    }, []);

    // if user is logged in, load all resources
    useEffect(() => {
        if (!user.email) {
            return
        }
        const loadResources = async () => {
            await Promise.all([getSnapshots(), getRecentSearches(), getControlReqs(), getGroupSnapshots(), getOneDriveSnapshots()])
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
        // await instance.logoutRedirect({
        //     account: accounts[0],
        //     postLogoutRedirectUri: "http://localhost:3000/"
        // });
        return navigate("/");
    }, [setUser, setLoggedIn, navigate])

    const setGoogleAcc = useCallback( async (accEmail, googleEmail) => {
        try {
            const res = await api.setLinkedGoogle({email: accEmail, googleId: googleEmail});
            if (res.status === 200) {
                let user = res.data.user;
                const currentUser = JSON.parse(localStorage.getItem("user"));
                if (currentUser.hasOwnProperty("oneDriveId")) {
                    user.oneDriveId = currentUser.oneDriveId
                }
                // set the state of the user
                setUser(user);
                // store the user in localStorage
                localStorage.setItem('user', JSON.stringify(user))
            }
            return navigate("/files");
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    }, [navigate])

    const setOneDriveAcc = useCallback(async(accEmail, oneDriveEmail) => {
        try {
            const res = await api.setLinkedOneDrive({email: accEmail, oneDriveId: oneDriveEmail});
            if (res.status === 200) {
                let user = res.data.user;
                const currentUser = JSON.parse(localStorage.getItem("user"));
                if (currentUser.hasOwnProperty("googleId")) {
                    user.googleId = currentUser.googleId
                }
                // set the state of the user
                setUser(user);
                // store the user in localStorage
                localStorage.setItem('user', JSON.stringify(user))
            }
            console.log(user);
            return navigate("/ODfiles");
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

    const getOneDriveSnapshots = useCallback( async () => {
        try {
            const res = await api.getUserProfile({email: user.email});
            const res2 = await api.getSnapshots(res.data.oneDriveSnap);
            setOneDriveSnapshots(res2.data);
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    },[user.email])

    const createNewSnapshot = useCallback( async (snapshot, email, drive) => {
        try {
            const res = await api.createSnapshot({snapshot: snapshot, email: email, drive: drive})
            if (res.status === 200 && drive == "googleDrive") {
                await getSnapshots();
            }
            if(res.status === 200 && drive =="oneDrive"){
                console.log("getting new od snap");
                await getOneDriveSnapshots();
            }
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    }, [getSnapshots])

    const createOneDriveSnapshot = useCallback( async (accessToken) => {
        try{
            startLoading();
            const res = await api.createOneDriveSnapshot({accessToken: accessToken, email: user.email})
            if(res.status === 200)
                await getOneDriveSnapshots();
            finishLoading();
        }
        catch(err){
            return err.response.data.errorMessage;
        }
    }, [getOneDriveSnapshots])

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

    const getODFolderFileDif = useCallback( async (id) => {
        try {
            console.log(id);
            const res = await api.getODFileFolderDif(id);
            if (res.status === 200) {
                console.log(res.data)
                return res.data;
            }
        }
        catch (err) {
            console.log(err);
            return err.response.data.errorMessage;
        }
    }, [])

    const getDeviantFiles = useCallback( async (snapshot, threshold) => {
        try {
            const res = await api.deviant({snapshot: snapshot, threshold: threshold})
            if (res.status === 200) {
                console.log(res.data)
                return res.data
            }
        }
        catch (err) {
            return err.response.data.errorMessage;
        }
    }, [])

    const getODDeviantFiles = useCallback( async (snapshot, threshold) => {
        try {
            const res = await api.getODDeviant({snapshot: snapshot, threshold: threshold})
            if (res.status === 200) {
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

    const getODSnapShotDiff = useCallback( async (oldSnapshot, currSnapshot) => {
        try {
            const res = await api.getODSnapDif({oldSnapshot: oldSnapshot, currSnapshot: currSnapshot});
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

    /**
     * searchCheckFile
     * This function searches through the query operator itself and applies the query operation by checking
     * specific fields of a file.
     * @param {*} operator is the query operator, ie: "name" or "owner"
     * @param {*} operand is the query operand, so may be a specific email or name.
     * @param {*} filePassed is the file that is currently looked at
     * @param {*} addedFilesSet is an array of files that is needed for specific query operators.
     * @param {*} snapshot the snapshot that is passed in - will be passed into helper functions too if needed.
     * @param {*} folderId is the folderId - value is only present for "folder" and "inFolder" query operators.
     * @param checkGrpMem flag to check if system should check group memberships or not
     * @returns an array with the query operator applied to the query operand.
     */
    const searchCheckFile = (operator, operand, filePassed, addedFilesSet, snapshot, folderId, checkGrpMem, sharedDrives) => {
        let filesAdded = null; // update this "dummy" array and then return this as the return for "searchCheckFiles"
        // console.log(operator);
        // console.log(operand);
        console.log(sharedDrives);
        if(operator === "drive"){
            if(operand === "MyDrive"){
                console.log(filePassed);
                if(filePassed.ownedByMe === true || filePassed.shared === true){
                    filesAdded = filePassed;
                }
            } else{ // shared drive. -> then name is passed in.
                // shouldn't go in here.
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
                if (checkFileHasOperandWithRole(perm, "reader", operand, checkGrpMem, snapshot)) {
                    filesAdded = filePassed;
                }
            })
        } else if(operator === "writeable"){
            filePassed.permissions.forEach((perm) => {
                if (checkFileHasOperandWithRole(perm, "writer", operand, checkGrpMem, snapshot)) {
                    filesAdded = filePassed;
                }
            })
        } else if(operator === "shareable"){
            console.log(filePassed);
            if(filePassed.owner === operand){
                filesAdded = filePassed;
            } else{ // then the email passed is not the owner of the file - only other way to have 
                    // sharing capabilites is if the user has the "organizer" role present.
                filePassed.permissions.forEach((perm) => {
                    if (perm.emailAddress === operand) { 
                        if(perm.role === "organizer"){
                            filesAdded = filePassed;
                        }
                    }
                })
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
        } else if(operator === "anyone"){ // sharing:anyone
            filePassed.permissions.forEach((perm) => {
                console.log("in here!");
                if(perm.id === "anyoneWithLink"){
                    console.log(filePassed);
                    filesAdded = filePassed;
                }
            })
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
        }else if(operator === "individual"){
            if(filePassed.permissions.length === 2){
                filesAdded = filePassed;
            }
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

    const checkFileHasOperandWithRole = (perm, role, operand, checkGrpMem, snapshot) => {
        switch (perm.type) {
            case "user":
                if (perm.emailAddress === operand) {
                    if(perm.role === role){
                        return true;
                    }
                }
                break;
            case "domain":
                if (operand.endsWith("@" + perm.domain)) {
                    if(perm.role === role){
                        return true
                    }
                }
                break;
            case "group":
                if (checkGrpMem) {
                    let members = checkForGroupMemSnapshot(snapshot, perm.emailAddress)
                    if (members.includes(operand) && perm.role === "reader") {
                        return true
                    }
                }
                break;
            default:
                return false
        }
        return false
    }

    // Helper function to help check group members within
    const checkForGroupMemSnapshot = (fileSnapshot, groupEmail) => {
        // get selected snapshots timestamp
        let searchedFileSnapTime = new Date(fileSnapshot.date).getTime();

        // check if exists a grp snapshot for given email
        if (groupSnapshots.some(({email}) => email === groupEmail)) {
            // filter for current groups snapshots and map their difference in times to file snapshot
            let currentGrpSnaps = groupSnapshots.filter(({email}) => email === groupEmail).map((snap) => {
                const {_id, members, date} = snap
                return (
                    {
                        id: _id,
                        members: Array.from(new Set(members)),
                        timeDiff: Math.abs(searchedFileSnapTime - new Date(date).getTime())
                    }
                )
            })
            // find grp snapshot with the closest timestamp to searched file snapshots timestamp and return members
            return (currentGrpSnaps.reduce(function(prev, curr) {
                return prev.timeDiff < curr.timeDiff ? prev : curr;
            }).members)
        } else {
            return [];
        }
    }

    /**
     * checkForSubFolders: helper function for "folder:regexp" query operator ONLY. This function checks to see if there
     * exists a sub folder which has files in it that needs to be shown in the front end.
     * @param snapshot is the snapshot that will be iterated over.
     * @param folderId is the id of the folder.
     * @param addedFiles is the files that are currently stored for the specific folder.
    */
    const checkForSubFolders = (snapshot, folderId, addedFiles) => {
        Object.entries(snapshot.folders).forEach((key, value) => {
            if(key[0] === folderId){
                let index = 0;
                while(index < (Object.values(key[1]).length)){
                    let file = Object.values(key[1])[index];
                    
                    addedFiles.push(file);
                    checkForSubFolders(snapshot, file.id, addedFiles);
                    index += 1;
                }
            }
        })
        return addedFiles;
    }

    /**
     * searchFolder searches through a folder for the "folder:regexp" and "inFolder:regexp" query operators.
     * @param {*} operator is the query - either "folder" or "inFolder"
     * @param {*} snapshot is the snapshot that we are going to iterate over.
     * @param {*} folderId is the folder id of the folder we are trying to search for.
     * @returns the files or subFolders, depending on which operator is passed, obtained from the folder id that 
     * was passed in to the function. 
     */
    const searchFolder = (operator, snapshot, folderId) => {
        let toAdd = []; // toAdd: global array that will be returned in this function.
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
                        if(file.type === "file"){
                            toAdd.push(file);
                        } else{
                            toAdd.push(file); // push in file name.
                            toAdd = checkForSubFolders(snapshot, file.id, toAdd);
                        }
                        index += 1;
                    }
                }
            })
        }
        return toAdd;
    }

    /**
     * recursiveSearch: function used for the path query operator which recursivrly searches
     * through the folders present for the snapshot passed.
     * @param {*} snapshot is the snapshot that was passed.
     * @param {*} keyOperator the current query operator.
     * @param {*} folderId the id of the folder
     * @param {*} addedFiles result array to be returned.
     * @returns addedFiles
     */
    const recursiveSearch = (snapshot, keyOperator, folderId, addedFiles) => {
        Object.entries(snapshot.folders).forEach((key, value) => {
            if(key[0] === folderId){
                let nameToMatch = ""; // nameToMatch: will check the name of the folder
                let isLast = keyOperator.indexOf("/"); // isLast: flag to check whehter or not path is complete.
                if(isLast === -1){
                    let index = 0; // index: used to iterate over keys length. 
                    while(index < (Object.values(key[1]).length)){
                        let file = Object.values(key[1])[index];
                        addedFiles.push(file);
                        index += 1;
                    }
                    return addedFiles;
                } else{
                    nameToMatch = keyOperator.substring(keyOperator.indexOf("/") + 1);
                    if(nameToMatch.indexOf("/") !== -1){
                        nameToMatch = nameToMatch.substring(0, nameToMatch.indexOf("/"));
                    }
                }
                
                let indexHere = 0;
                while(indexHere < (Object.values(key[1]).length)){
                    let file = Object.values(key[1])[indexHere];
                    if(file.name === nameToMatch){
                        if(isLast === -1){
                            let index = 0;
                            while(index < (Object.values(key[1]).length)){
                                let file = Object.values(key[1])[index];
                                addedFiles.push(file);
                                index += 1;
                            }
                            return addedFiles;
                        } else{
                            let file = Object.values(key[1])[indexHere];
                            keyOperator = keyOperator.substring(keyOperator.indexOf("/") + 1);
                            recursiveSearch(snapshot, keyOperator, file.id, addedFiles);
                        }
                    }
                    indexHere += 1;
                }
            }
        })
        return addedFiles;
    }

    const searchThroughForDrive = (snapshot, key, sharedDrives) => {
        let result = [];
        let resultIndex = 0;
        let index = 0
        console.log(sharedDrives);
        while(index < sharedDrives.length){
            let secondIndex = 0;
            if(sharedDrives[index].name === key) {
                console.log(sharedDrives[index]);
                while(secondIndex < sharedDrives[index].sharedFiles.length){
                    result[resultIndex++] = sharedDrives[index].sharedFiles[secondIndex];
                    secondIndex += 1;
                }
                if(secondIndex !== 0){
                    console.log(result);
                    break;
                }
            } // drive:drive:JJEV-shared
            index += 1;
        }
        return result;
    }

    /**
        performSearch
        This function performs the search for query operations passed in. There will be helper functions that will be called.
        @param snapshot is the snapshot to be iterated over.
        @param queries is the qeuries array which holds all of the queries and boolean operators.
        @param save is a boolean which is used at the end to either save or not save the results.
        @returns "results" which is the result of the query.
    */
    const performSearch = useCallback (async (snapshot, queries, save, sharedDrives) => {
        
        let set = new Set(); // set: will check to see if the file already exists in the array to be returned.
        let results = []; // result: where all of the files are stored that are to be returned.
        let inParenthesis = []; // inParenthesis: will be holding the files that are present for the temporary result within parenthesis.
        let pFlag = 0; // pFlag: is the flag to be used to check if there is a parenthesis present.
        let saveIndex = 0; // saveIndex: int variable that holds the index for where the first "(" was seen.
        let grpFlag = true; // grpFlag: flag to check whether to take group memberships into account or not.
        
        let index = 0; // index: int variable used to iterate over the queries array that was passed in.

        while(index < queries.length) {
            let keyValue = ""; // keyValue: is the key for the current query operator.
            keyValue = queries[index].substring(queries[index].indexOf(":") + 1);
            let operator = queries[index].substring(0, queries[index].indexOf(":") + 1); // operator: is the operator for the current query operator.
            let buildOutKey = ""; // buildOutKey: used for edge cases where there could be a "(" or "-" in front of the key.
            let startingOutIndex = index; // startingOutIndex is used to if there is a "(" or "-" present.
            if(keyValue[0] === "\""){
                while(keyValue[keyValue.length-1] !== "\""){
                    if(index > queries.length){
                        break;
                    }
                    keyValue = queries[index].substring(queries[index].indexOf(":") + 1);
                    if(keyValue[0] === "\""){
                        buildOutKey = keyValue.substring(1); // don't include first starting quote since the starting quote isn't a part of the actual query.
                    } else{
                        if(keyValue[keyValue.length-1] !== "\""){ buildOutKey += " " + keyValue; } 
                        else{ buildOutKey += " " + keyValue.substring(0, keyValue.length -1); }   
                    }
                    index += 1;
                }

                let toPutIn = operator + buildOutKey; // toPutIn: updates the operator to include all of the spaces that are present in between the quotes.
                                                        // ie: name:"JJEV Assignment 05" -> toPutin would be: name:JJEV Assignment 05

                let indexCompare = 0; // indexCompare: used to check if the index is the first index in the below loop.
                let newQueries = []; // newQueries: queries result is set to "newQueries" once below loop finishes.
                let seenFlag = 0; // used to check if a duplicate operator will be parsed through.
                while(indexCompare < queries.length){
                    if(indexCompare >= startingOutIndex && seenFlag === 0){
                        let tempIndex = 0; // tempIndex: used to iterator over the queries inside of the parentheses.
                        while(tempIndex < ((index - startingOutIndex) - 1)){
                            indexCompare += 1;
                            tempIndex += 1;
                        }
                        newQueries.push(toPutIn); // then push it in.
                        seenFlag = 1;
                    } else{
                        newQueries.push(queries[indexCompare]);
                    }
                    indexCompare += 1;
                }
                queries = newQueries;
            } else{
                index += 1; // if no quotes, just go on with the code.
            }
        }

        await api.addRecentSearch({ // adds the most recent query operator search to the recent searches array. 
            query: queries.join(" "),
            email: user.email
        })

        // check if query starts with "groups:off and" directive and set flag to true if true
        if (queries[0].includes("groups:off") &&  queries[1] === "and") {
            grpFlag = false;
            queries.splice(0,2)
        }

        index = 0; // index reset to 0 to iterator through query operators and call helper functions to check query.
        while(index < queries.length){
            let tempResult = []; // result for one query - tempResult result is compared to the global results array.
            let tempResultIndex = 0; // index used to set values of tempResult throughout this while loop.
            let value = queries[index].substring(0, queries[index].indexOf(":")); // is the value of the query operator.
            let vFlag = 0; // used to check to see if there is a "-" in front of the query.
            let firstParenthesis = 1; // set to 0 if the first parenthesis was seen.
            let lastParenthsis = 1; // set to 0 if the last parenthesis was seen.
            let vPFlag = 0; // flag to check whether or not both a "(" and "-" was seen.

            if(value[0] === "-"){
                value = value.substring(1); // don't include "(" in the actual query search.
                vFlag = 1;
            } else if(value[0] === "("){
                if(value[1] === "-"){
                    vPFlag = 1;
                    value = value.substring(1); // get rid of the "-" in the value string
                }
                pFlag = 1;
                saveIndex = index;
                firstParenthesis = 0;
                value = value.substring(1); // get rid of the "(" in the value string
                console.log(value);
            }

            let key = queries[index].substring(queries[index].indexOf(":") + 1); // is the key for the query operator.
            if(value === "drive"){
                key = queries[index].substring(queries[index].lastIndexOf(":") + 1);
            }
            if(key[key.length-1] === ")"){ // if closing parenthesis is seen, then operators within the parens can be evaluated.
                lastParenthsis = 0;
                key = key.substring(0, key.length-1);
            }

            // special query operators below (for our implementation): 
            console.log("value: " + value + ", key: " + key);
            if(key === "none"){
                value = "none";
            } else if(key === "domain"){
                value = "domain";
            } else if(value === "sharing" && key === "individual"){
                value = "individual";
            } else if(value === "sharing" && key === "anyone"){
                value = "anyone";
            }
            
            if(index % 2 === 0){ // non boolean operator since boolean operators allways fall in the odd index.
                Object.values(snapshot.folders).forEach((folder) => { // iterating over each folder in the snapshot passed.
                    Object.values(folder).forEach((file) => { // iterate over each file in each respective folder.
                        if(value === "inFolder" || value === "folder"){ // inFolder or folder operator only
                            let forOneFolder = [];
                            let regexp = new RegExp(key);
                            if(regexp.exec(file.name) && file.type === "folder"){
                                forOneFolder = searchFolder(value, snapshot, file.id);
                                let index = 0; // index: used to iteratrate over the loop below
                                let tIndex = 0; // tIndex: int to store current index of the temp array
                                while(index < forOneFolder.length){
                                    if(tempResult[tIndex]){ tIndex += 1; }
                                    else{ tempResult[tIndex++] = forOneFolder[index++]; }
                                }
                            }
                        } else if(value === "path"){ // path variable only
                            let firstFile = "";
                            if(key.indexOf("/") === -1){ // no more sub folders to consider. 
                                firstFile = key;
                            } else{
                               firstFile = key.substring(0, key.indexOf("/"));
                            }
                            if(file.name === firstFile && file.type === "folder"){ 
                                tempResult = recursiveSearch(snapshot, key, file.id, []);
                            }
                        } else if(value === "drive" && key !== "MyDrive"){
                            console.log(sharedDrives);
                            tempResult = searchThroughForDrive(snapshot, key, sharedDrives);
                            console.log(tempResult);
                            // let index = 0; // index: used to iteratrate over the loop below
                            // let tIndex = 0; // tIndex: int to store current index of the temp array
                            // console.log(filesHere);
                            // while(index < filesHere.length){
                            //     if(tempResult[tIndex]){ tIndex += 1; }
                            //     else{ tempResult[tIndex++] = filesHere[index++]; }
                            // }
                        } else{ // all other query operator values.
                            let resultHere = searchCheckFile(value, key, file, set, snapshot, "", grpFlag, sharedDrives);
                            if(resultHere){ tempResult[tempResultIndex++] = resultHere; console.log(tempResult); }
                        }
                    })
                })

                // check all files for a possible "-" in front of their file names.
                if(vFlag || vPFlag){ // then iterate through all files and only pick the one's that are not in current
                    // temp results array.
                    let indexHere = 0; // indexHere: used to iterate over below array.
                    let setHere = new Set(); // don't add duplicate files from below:
                    while(indexHere < tempResult.length){
                        setHere.add(tempResult[indexHere++].id);
                    }

                    let tempIndex = 0; // tempIndex: int to store current index of the temp array
                    tempResult = []; // tempResult: contains result of query operator.
                    Object.values(snapshot.folders).forEach((folder) => {
                        Object.values(folder).forEach((file) => {
                            if(!setHere.has(file.id)){
                                tempResult[tempIndex++] = file;
                            }
                        })
                    })
                }

                // if it is the first query operator, no other query operator to compare against, so just 
                // set the value of the results array to the results from the query operation.
                if(index === 0 && pFlag === 0) { results = tempResult; }
                else {
                    // apply boolean operator.
                    if(pFlag === 0){ // no parenthesis present.
                        if(queries[index-1] === "and"){
                            
                            let setOfParentFiles = new Set();
                            let indexHere = 0;
                            while(indexHere < results.length){ setOfParentFiles.add(results[indexHere++].id); }

                            indexHere = 0;
                            let andResults = []; // andResults: storing temp results if boolean operator is "and" 
                            let andResultsIndex = 0; // andResultsIndex: index for and array.
                            while(indexHere < tempResult.length){
                                if(setOfParentFiles.has(tempResult[indexHere].id)){
                                    andResults[andResultsIndex++] = tempResult[indexHere]; // add this file to it.
                                }
                                indexHere += 1;
                            }
                            results = andResults;
                        } else if(queries[index-1] === "or"){
                            let orResults = []; // orResults: storing temp results if boolean operator is "or" 
                            let setHere = new Set(); // setHere: intiailized so there is no duplicate files.
                            let orResultsIndex = 0; // orResultsIndex: index for or array.
                            while(orResultsIndex < results.length){
                                orResults[orResultsIndex] = results[orResultsIndex];
                                setHere.add(results[orResultsIndex]);
                                orResultsIndex += 1;
                            }
                            
                            let indexHere = 0; // indexHere: int variable to loop over below array.
                            while(indexHere < tempResult.length){
                                if(!setHere.has(tempResult[indexHere])){
                                    orResults[orResultsIndex] = tempResult[indexHere];
                                    orResultsIndex += 1;
                                }
                                indexHere += 1;
                            }
                            results = orResults; // setting global results to result obtained from current operator.
                        }
                    } else{ // parenthesis present.
                        if(firstParenthesis === 0){ // first key/value w/in the parenthesis.
                            inParenthesis = tempResult;
                        }
                        else{ // apply "and" or "or" operators.
                            if(queries[index-1] === "and"){
                                let setOfParentFiles = new Set();
                                let indexHere = 0;
                                while(indexHere < inParenthesis.length){
                                    setOfParentFiles.add(inParenthesis[indexHere++].id);
                                }

                                indexHere = 0;
                                let andResults = []; // andResults: storing temp results if boolean operator is "and" 
                                let andResultsIndex = 0; // andResultsIndex: index for and array.
                                while(indexHere < tempResult.length){
                                    if(setOfParentFiles.has(tempResult[indexHere].id)){
                                        andResults[andResultsIndex++] = tempResult[indexHere];
                                    }
                                    indexHere += 1;
                                }
                                inParenthesis = andResults;
                            } else if(queries[index-1] === "or"){
                                let orResults = []; // orResults: storing temp results if boolean operator is "or" 
                                let setHere = new Set(); // don't add duplicate files from below:
                                let orResultsIndex = 0; // orResultsIndex: index for or array.
                                while(orResultsIndex < inParenthesis.length){
                                    orResults[orResultsIndex] = inParenthesis[orResultsIndex];
                                    setHere.add(results[orResultsIndex]);
                                    orResultsIndex += 1;
                                }
                                
                                let indexHere = 0; // indexHere: used to iterate over below loop.
                                while(indexHere < tempResult.length){
                                    if(!setHere.has(tempResult[indexHere])){
                                        orResults[orResultsIndex] = tempResult[indexHere];
                                        orResultsIndex += 1;
                                    }
                                    indexHere += 1;
                                }
                                inParenthesis = orResults;
                            }

                            // if it is the last parenthesis, then compare to the larger-scoped "results" array
                            if(lastParenthsis === 0){
                                // if it was the first index, just set result to the result to the results
                                // obtained within the parenthesis.
                                if(saveIndex === 0){
                                    results = inParenthesis
                                }

                                // comparing boolean ope`rator between the query operators and opening parenthesis, ie:
                                // [query1] and ([query2] or [query3]) -> [query1] and the values inside of "()" 
                                // are compared with the following coniditonals:
                                if(queries[saveIndex-1] === "and"){
                                    let setOfParentFiles = new Set(); // setOfParentFiles: used to check for "and" condition
                                    let indexHere = 0; // indexHere: for loop below
                                    while(indexHere < results.length){
                                        setOfParentFiles.add(results[indexHere++].id);
                                    }
        
                                    indexHere = 0; // indexHere: loop variable reset to loop over second array.
                                    let andResults = []; // andResults: storing temp results if boolean operator is "and" 
                                    let andResultsIndex = 0; // andResultsIndex: index for and array. 
                                    while(indexHere < inParenthesis.length){
                                        if(setOfParentFiles.has(inParenthesis[indexHere].id)){
                                            andResults[andResultsIndex++] = inParenthesis[indexHere];
                                        }
                                        indexHere += 1;
                                    }
                                    results = andResults;
                                } else if(queries[saveIndex-1] === "or"){
                                    let orResults = []; // orResults: storing temp results if boolean operator is "or" 
                                    let setHere = new Set(); // don't add duplicate files from below:
                                    let orResultsIndex = 0; // orResultsIndex: index for or array.
                                    while(orResultsIndex < results.length){
                                        orResults[orResultsIndex] = results[orResultsIndex];
                                        setHere.add(results[orResultsIndex]);
                                        orResultsIndex += 1;
                                    }
                                    let indexHere = 0;
                                    while(indexHere < inParenthesis.length){
                                        if(!setHere.has(inParenthesis[indexHere])){
                                            orResults[orResultsIndex] = inParenthesis[indexHere];
                                            orResultsIndex += 1;
                                        }
                                        indexHere += 1;
                                    }
                                    results = orResults;
                                }
                            }
                        }
                    }
                }
            }
            // if it is the last parenthesis, reset the value of "lastParenthsis" since we do not want to 
            // assume that we are still inside of parentheses.
            if(lastParenthsis === 0){ pFlag = 0; }
            index += 1;
        }

        if (save) {
            setSearchResults({results: results, snapshot: snapshot._id})
        }
        else {
            return results;
        }
    },[searchCheckFile, searchFolder, user.email])

    // check if a specific user email is within a specific domain
    const checkInDomains = useCallback ((user, domains) => {
        let found;
        if (user.includes("@")) {
            found = domains.find(domain => user.endsWith("@" + domain))
        } else {
            found = domains.find(domain => user === domain)
        }
        return !!found;
    },[])

    // checks if any files within a snapshot have violations to control reqs
    const checkViolations = useCallback((emailAddress, role, fileName, req, violationsList) => {
        // console.log(emailAddress)
        // console.log(role)
        const {aw, ar, dw, dr} = req;
        // console.log(ar)
        let currentViol = {
            file: fileName,
            user: emailAddress,
            role: role,
        }
        if (role === "owner") {
            return;
        }
        if (role === "reader" || role === "commenter") {
            // check if user is a reader but part of DR set
            if (dr.emails.length > 0 || dr.domains.length > 0) {
                if (dr.emails.includes(emailAddress) || checkInDomains(emailAddress, dr.domains)) {
                    currentViol.violation = "Denied Reader";
                }
            }
            // check if user is a reader but not a part of AR set
            else if (ar.emails.length > 0 || ar.domains.length > 0) {
                if (!ar.emails.includes(emailAddress) && !checkInDomains(emailAddress, ar.domains)) {
                    currentViol.violation = "Allowed Reader";
                }
            }
        }
        else if (role === "writer" || role === "editor") {
            // check if user is a writer but part of DW set
            if (dw.emails.length > 0 || dw.domains.length > 0) {
                if (dw.emails.includes(emailAddress) || checkInDomains(emailAddress, dw.domains)) {
                    currentViol.violation = "Denied Writer";
                }
            }
            // check if user is a writer but not a part of AW set
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

    // gets all files that are relevant to the search query for a given control requirement
    const getControlReqQueryFiles = useCallback(async (req, snapshot) => {
        const {query} = req;
        console.log(query)
        return await performSearch(snapshot, query.split(" "), false)
    }, [performSearch])

    // check if the resulting changes to a users perm would result in a violation of any existing control reqs or not
    const checkReqsBeforeUpdate = useCallback(async (filesToUpdate) => {
        // console.log(filesToUpdate)
        let violation = false;
        for (const req of controlReqs) {
            // console.log(req)
            const index = controlReqs.indexOf(req);
            let currentViolations = {
                index: index + 1,
                violations: [],
            }
            // get relevant files of search query
            let searchResults = await getControlReqQueryFiles(req, snapshots[0])
            console.log(searchResults)
            // find which files you are currently updating that are relevant to any control requirement search queries
            let filteredFiles = filesToUpdate.filter(({name}) => searchResults.some((file) => file.name === name))
            console.log(filteredFiles)
            filteredFiles.forEach(({name, updatedUsers, newUsers}) => {
                // check if any update to existing users causes violation
                updatedUsers.forEach(user => {
                    const {email, role, type} = user;
                    switch (type) {
                        case "user":
                        case "domain":
                            checkViolations(email, role, name, req, currentViolations)
                            break;
                        case "group":
                            let members = checkForGroupMemSnapshot(snapshots[0], email);
                            members.forEach(member => checkViolations(member, role, name, req, currentViolations))
                            break;
                        default:
                            break;
                    }
                })
                // check if any newly added users causes violation
                newUsers.forEach(user => {
                    const {email, role, type} = user;
                    // check if new user is an existing group within snapshots
                    if (email.endsWith("@googlegroups.com")) {
                        let members = checkForGroupMemSnapshot(snapshots[0], email);    // get members from a snapshot
                        members.forEach(member => checkViolations(member, role, name, req, currentViolations)) // check if each member violates control req
                    } else {
                        switch (type) {
                            case "user":
                            case "domain":
                                checkViolations(email, role, name, req, currentViolations)
                                break;
                            case "group":
                                break;
                            default:
                                break;
                        }
                    }
                })
            })
            if (currentViolations.violations.length > 0) {
                violation = true;
                break;
            }
        }
        return violation
    },[checkViolations, controlReqs, getControlReqQueryFiles, snapshots])

    // check if a files permission is direct or inherited
    const checkPermissionSrc = useCallback( (fileInfo, permId, snapId) => {
        const {parents} = fileInfo;
        let workingSnap = snapshots.find(({_id}) => _id === snapId);

        // if parents does not exist, file is likely directly assigned permissions
        if (!parents) {
            return "direct"
        }
        else {
            let src = "direct"
            // iterate through each folder
            Object.values(workingSnap.folders).every(file => {
                // check if folder has parent file of file the permission originates from
                if (file.hasOwnProperty(parents[0])) {
                    // check if parent file has the permission from the original perm
                    if (file[parents[0]].permissions.some((perm) => perm.id === permId)) {
                        src = "inherited"
                        return false;
                    }
                }
                return true
            })
            return src
        }
    },[snapshots])

    return (
        <UserContext.Provider value={{
            user, snapshots, isLoading, loggedIn, recentSearches, createUser, loginUser, logoutUser, startLoading, finishLoading, 
            setGoogleAcc, createNewSnapshot, getFolderFileDif, getSnapShotDiff, searchByName, getRecentSearches, createNewControlReq,
            controlReqs, deleteControlReq, setIsLoading, performSearch, searchResults, groupSnapshots, createNewGroupSnapshot,
            getControlReqQueryFiles, checkInDomains, checkViolations, checkReqsBeforeUpdate, getDeviantFiles, checkPermissionSrc, oneDriveSnapshots, 
            getODFolderFileDif, getODSnapShotDiff, getODDeviantFiles, setOneDriveAcc, createOneDriveSnapshot,
            getSnapshots,
            checkForGroupMemSnapshot
        }}>
            {props.children}
        </UserContext.Provider>
    );
    
}

export default UserContextProvider;