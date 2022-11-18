import React, {createContext, useCallback, useEffect, useState} from "react";
import api from '../../api/ShareManagerAPI'
import {useNavigate} from "react-router-dom";
import ControlReqQueriesLists from "../ControlReqQueriesLists";
import controlReqsList from "../ControlReqQueriesLists";
import { Stack } from "react-bootstrap";
import { queryByTestId } from "@testing-library/react";

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
     * @returns an array with the query operator applied to the query operand.
     */
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
     * checkForSubFolders: helper function for "folder:regexp" query operator ONLY. This function checks to see if there
     * exists a sub folder which has files in it that needs to be shown in the front end.
     * @param snapshot is the snapshot that will be iterated over.
     * @param folderId is the id of the folder.
     * @param addedFiles is the files that are currently stored for the specific folder.
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

    /**
     * searchFolder searches through a folder for the "folder:regexp" and "inFolder:regexp" query operators.
     * @param {*} operator is the query - either "folder" or "inFolder"
     * @param {*} snapshot is the snapshot that we are going to iterate over.
     * @param {*} folderId is the folder id of the folder we are trying to search for.
     * @returns the files or subFolders, depending on which operator is passed, obtained from the folder id that 
     * was passed in to the function. 
     */
    const searchFolder = (operator, snapshot, folderId) => {
        let toAdd = [];
        console.log(snapshot);
        console.log(folderId);
        if(operator === "inFolder"){
            Object.entries(snapshot.folders).forEach((key, value) => {
                if(key[0] === folderId){
                    console.log(Object.values(key[1]));
                    let index = 0;
                    while(index < (Object.values(key[1]).length)){
                        console.log("adding in here");
                        toAdd.push(Object.values(key[1])[index]);
                        index += 1;
                    }
                }
            })
            console.log(toAdd);
        } else if(operator === "folder"){
            Object.entries(snapshot.folders).forEach((key, value) => {
                if(key[0] === folderId){
                    let index = 0;
                    while(index < (Object.values(key[1]).length)){
                        let file = Object.values(key[1])[index];
                        console.log(file);
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
        console.log(toAdd);
        return toAdd;
    }

    const recursiveSearch = (snapshot, keyOperator, folderId, addedFiles) => {
        Object.entries(snapshot.folders).forEach((key, value) => {
            if(key[0] === folderId){
                let nameToMatch = "";
                let isLast = keyOperator.indexOf("/");
                if(isLast === -1){
                    let index = 0;
                    while(index < (Object.values(key[1]).length)){
                        let file = Object.values(key[1])[index];
                        addedFiles.push(file);
                        index += 1;
                    }
                    console.log(addedFiles);
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

    /**
        performSearch
        This function performs the search for query operations passed in. There will be helper functions that will be called.
        @param snapshot is the snapshot to be iterated over.
        @param queries is the qeuries array which holds all of the queries and boolean operators.
        @param save is a boolean which is used at the end to either save or not save the results.
        @returns "results" which is the result of the query.
    */
    const performSearch = useCallback (async (snapshot, queries, save) => {
        
        let set = new Set();
        let results = [];
        let inParenthesis = [];
        let pFlag = 0;
        let saveIndex = 0;
        
        let index = 0;

        console.log(queries);
        while(index < queries.length){
            let keyValue = "";
            keyValue = queries[index].substring(queries[index].indexOf(":") + 1);
            let operator = queries[index].substring(0, queries[index].indexOf(":") + 1);
            let buildOutKey = "";
            let startingOutIndex = index;
            if(keyValue[0] === "\""){
                while(keyValue[keyValue.length-1] !== "\""){
                    if(index > queries.length){
                        break;
                    }
                    keyValue = queries[index].substring(queries[index].indexOf(":") + 1);
                    if(keyValue[0] === "\""){
                        console.log(keyValue.substring(1));
                        buildOutKey = keyValue.substring(1); // don't include first starting quote.
                    } else{
                        if(keyValue[keyValue.length-1] !== "\""){ buildOutKey += " " + keyValue; } 
                        else{ buildOutKey += " " + keyValue.substring(0, keyValue.length -1); }   
                    }
                    index += 1;
                }

                let toPutIn = operator + buildOutKey;

                let indexCompare = 0;
                let newQueries = [];
                let seenFlag = 0;
                while(indexCompare < queries.length){
                    if(indexCompare >= startingOutIndex && seenFlag === 0){
                        let tempIndex = 0;
                        while(tempIndex < ((index - startingOutIndex) - 1)){
                            indexCompare += 1;
                            tempIndex += 1;
                        }
                        newQueries.push(toPutIn); // then push it in.
                        seenFlag = 1;
                    } else{
                        console.log("queries[indexCompare]: " + queries[indexCompare]);
                        newQueries.push(queries[indexCompare]);
                    }
                    indexCompare += 1;
                }
                queries = newQueries;
                console.log(queries);
            } else{
                index += 1; // if no quotes, just go on with the code.
            }
        }
       
        console.log(queries);

        await api.addRecentSearch({
            query: queries.join(" "),
            email: user.email
        })

        index = 0;
        while(index < queries.length){
            let tempResult = [];
            let tempResultIndex = 0;
            let value = queries[index].substring(0, queries[index].indexOf(":"));
            let vFlag = 0;
            let firstParenthesis = 1;
            let lastParenthsis = 1;
            let vPFlag = 0;

            console.log(value + ", value[0]: " + value[0]);
            if(value[0] === "-"){
                value = value.substring(1);
                vFlag = 1;
            } else if(value[0] === "("){
                if(value[1] === "-"){
                    vPFlag = 1;
                    value = value.substring(1); // get rid of the "(" in the value string
                }
                pFlag = 1;
                saveIndex = index;
                firstParenthesis = 0;
                value = value.substring(1); // get rid of the "-" in the value string
                console.log(value);
            }

            let key = queries[index].substring(queries[index].indexOf(":") + 1);
            if(key[key.length-1] === ")"){
                lastParenthsis = 0;
                key = key.substring(0, key.length-1);
                console.log(key);
            }

            if(key === "none"){
                value = "none";
            } else if(key === "domain"){
                value = "domain";
            } else if(value === "sharing" && key !== "anyone"){
                console.log("in here");
                value = "individual";
            } else if(value === "sharing" && key === "anyone"){
                value = "anyone";
            }

            console.log("value: " + value + ", key: " + key);
            
            if(index % 2 === 0){ // non boolean operator
                Object.values(snapshot.folders).forEach((folder) => {
                    Object.values(folder).forEach((file) => {
                        console.log(file);
                        if(value === "inFolder" || value === "folder"){
                            let forOneFolder = [];
                            let regexp = new RegExp(key);
                            if(regexp.exec(file.name) && file.type === "folder"){
                                forOneFolder = searchFolder(value, snapshot, file.id);
                                let index = 0;
                                let tIndex = 0;
                                console.log(forOneFolder);
                                while(index < forOneFolder.length){
                                    console.log(tempResult[tIndex]);
                                    console.log("index: " + index + ", tIndex: " + tIndex);
                                    if(tempResult[tIndex]){
                                        tIndex += 1;
                                    }else{
                                        console.log("in else");
                                        tempResult[tIndex++] = forOneFolder[index++];
                                    }
                                }
                                console.log(tempResult);
                            }
                        } else if(value === "path"){
                            let firstFile = "";
                            if(key.indexOf("/") === -1){
                                firstFile = key;
                            } else{
                               firstFile = key.substring(0, key.indexOf("/"));
                            }
                            if(file.name === firstFile && file.type === "folder"){
                                tempResult = recursiveSearch(snapshot, key, file.id, []);
                            }
                        } else{
                            let resultHere = searchCheckFile(value, key, file, set, snapshot, "");
                            console.log(resultHere);
                            if(resultHere){ tempResult[tempResultIndex++] = resultHere; }
                        }
                    })
                })

                console.log(tempResult);
                console.log("vPFlag; " + vPFlag);
                // check all files for a possible "-" in front of their file names.
                if(vFlag || vPFlag){ // then iterate through all files and only pick the one's that are not in current
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
                console.log(tempResult);

                // if it is the first query operator, no other query operator to compare against, so just 
                // set the value of the results array to the results from the query operation.
                if(index === 0 && pFlag === 0) { results = tempResult; }
                else {
                    // apply boolean operator.
                    console.log("pflag: " + pFlag);
                    if(pFlag === 0){ // no parenthesis present.
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
                            let setHere = new Set();
                            let orResultsIndex = 0;
                            while(orResultsIndex < results.length){
                                orResults[orResultsIndex] = results[orResultsIndex];
                                setHere.add(results[orResultsIndex]);
                                orResultsIndex += 1;
                            }
                            
                            let indexHere = 0;
                            while(indexHere < tempResult.length){
                                if(!setHere.has(tempResult[indexHere])){
                                    orResults[orResultsIndex] = tempResult[indexHere];
                                    orResultsIndex += 1;
                                }
                                indexHere += 1;
                            }
                            results = orResults;
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
                                let andResults = [];
                                let andResultsIndex = 0;
                                while(indexHere < tempResult.length){
                                    if(setOfParentFiles.has(tempResult[indexHere].id)){
                                        andResults[andResultsIndex++] = tempResult[indexHere];
                                    }
                                    indexHere += 1;
                                }
                                inParenthesis = andResults;
                            } else if(queries[index-1] === "or"){
                                let orResults = [];
                                let setHere = new Set(); // don't add duplicate files from below:
                                let orResultsIndex = 0;
                                while(orResultsIndex < inParenthesis.length){
                                    orResults[orResultsIndex] = inParenthesis[orResultsIndex];
                                    setHere.add(results[orResultsIndex]);
                                    orResultsIndex += 1;
                                }
                                
                                let indexHere = 0;
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

                                // comparing boolean operator between the query operators and opening parenthesis, ie:
                                // [query1] and ([query2] or [query3]) -> [query1] and the values inside of "()" 
                                // are compared with the following coniditonals:
                                if(queries[saveIndex-1] === "and"){
                                    let setOfParentFiles = new Set();
                                    let indexHere = 0;
                                    while(indexHere < results.length){
                                        setOfParentFiles.add(results[indexHere++].id);
                                    }
        
                                    indexHere = 0;
                                    let andResults = [];
                                    let andResultsIndex = 0;
                                    while(indexHere < inParenthesis.length){
                                        if(setOfParentFiles.has(inParenthesis[indexHere].id)){
                                            andResults[andResultsIndex++] = inParenthesis[indexHere];
                                        }
                                        indexHere += 1;
                                    }
                                    results = andResults;
                                    console.log(results);
                                } else if(queries[saveIndex-1] === "or"){
                                    let orResults = [];
                                    let setHere = new Set();
                                    let orResultsIndex = 0;
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
                            console.log(results);
                            console.log(inParenthesis);
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
            getControlReqQueryFiles, checkInDomains, checkViolations, checkReqsBeforeUpdate, getDeviantFiles, checkPermissionSrc
        }}>
            {props.children}
        </UserContext.Provider>
    );
    
}

export default UserContextProvider;