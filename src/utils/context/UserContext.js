import React, {createContext, useCallback, useEffect, useState} from "react";
import api from '../../api/ShareManagerAPI'
import {useNavigate} from "react-router-dom";
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

    const searchCheckFile = (operator, operand, filePassed, addedFilesSet, snapshot, folderId) => {

        let filesAdded = null; // update this "dummy" array and then return this as the return for "searchCheckFiles"
        let fileForOperator = null;
        console.log(operator);
        console.log(operand);
        if(operator === "drive:drive"){
            if(operand === "My Drive"){
                console.log(filePassed);
                if(filePassed.ownedByMe === true){
                    if(!addedFilesSet.has(filePassed.name)){
                        addedFilesSet.add(filePassed.name);
                        filesAdded = filePassed;
                    }
                    fileForOperator = filePassed;
                }
            } else{
                if(filePassed.ownedByMe === false){
                    if(!addedFilesSet.has(filePassed.name)){
                        addedFilesSet.add(filePassed.name);
                        filesAdded = filePassed;
                    }
                    fileForOperator = filePassed;
                }
            }
        } else if(operator === "owner:user"){
            console.log(filePassed)
            if(filePassed.owner === operand){
                if(!addedFilesSet.has(filePassed.name)){
                    addedFilesSet.add(filePassed.name);
                    filesAdded = filePassed;
                }
                fileForOperator = filePassed;
            }
        } else if(operator === "creator:user"){
            if(filePassed.creator === operand){
                if(!addedFilesSet.has(filePassed.name)){
                    addedFilesSet.add(filePassed.name);
                    filesAdded = filePassed;
                }
                fileForOperator = filePassed;
            }
        } else if(operator === "readable:user"){
            filePassed.permissions.forEach((perm) => {
                if (perm.emailAddress === operand) {
                    if(perm.role === "reader"){
                        if(!addedFilesSet.has(filePassed.name)){
                            addedFilesSet.add(filePassed.name);
                            filesAdded = filePassed;
                        }
                        fileForOperator = filePassed;
                    }
                }
            })
        } else if(operator === "writeable:user"){
            filePassed.permissions.forEach((perm) => {
                if (perm.emailAddress === operand) {
                    if(perm.role === "writer"){
                        if(!addedFilesSet.has(filePassed.name)){
                            addedFilesSet.add(filePassed.name);
                            filesAdded = filePassed;
                        }
                        fileForOperator = filePassed;
                    }
                }
            })
        } else if(operator === "shareable:user"){
            console.log(filePassed);
            if(filePassed.owner === operand){
                if(!addedFilesSet.has(filePassed.name)){
                    addedFilesSet.add(filePassed.name);
                    filesAdded = filePassed;
                }
                fileForOperator = filePassed;
            }
        }else if(operator === "to:user"){
            console.log("in here");
            filePassed.permissions.forEach((perm) => {
                if (perm.emailAddress === operand) { // "ownedByMe" doesn't need to be true here.
                    if(perm.role !== "owner"){
                        if(!addedFilesSet.has(filePassed.name)){
                            addedFilesSet.add(filePassed.name);
                            filesAdded = filePassed;
                        }
                        fileForOperator = filePassed;
                    }
                }
            })
        } else if(operator === "from:user"){
            filePassed.permissions.forEach((perm) => {
                if (perm.emailAddress === operand) {
                    if(perm.role === "owner"){
                        if(!addedFilesSet.has(filePassed.name)){
                            addedFilesSet.add(filePassed.name);
                            filesAdded = filePassed;
                        }
                        fileForOperator = filePassed;
                    }
                }
            })
        } else if(operator === "name:regexp"){
            let regexp = new RegExp(operand);
            console.log(filePassed);
            if(regexp.exec(filePassed.name)){ // key is the regular expression.
                if(!addedFilesSet.has(filePassed.name)){
                    addedFilesSet.add(filePassed.name);
                    filesAdded = filePassed;
                }
                fileForOperator = filePassed;
            }
        } else if(operator === "sharing:none"){
            console.log("in here");
            if(filePassed.ownedByMe === true && filePassed.permissions.length === 1){
                console.log("owned By me");
                if(!addedFilesSet.has(filePassed.name)){
                    addedFilesSet.add(filePassed.name);
                    filesAdded = filePassed;
                }
                fileForOperator = filePassed;
            }
        } else if(operator === "sharing:domain"){
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
                            if(!addedFilesSet.has(filePassed.name)){
                                addedFilesSet.add(filePassed.name);
                                filesAdded = filePassed;
                            }
                            fileForOperator = filePassed;
                        }
                    }
                })
            }
        }else if(operator === "sharing:individual"){
            console.log("in here");
            filePassed.permissions.forEach((perm) => {
                if(filePassed.ownedByMe){
                    if (perm.emailAddress === operand) {
                        if(perm.role === "writer" || perm.role === "reader"){
                            if(!addedFilesSet.has(filePassed.name)){
                                addedFilesSet.add(filePassed.name);
                                filesAdded = filePassed;
                            }
                            fileForOperator = filePassed;
                        }
                    }
                }
            })
        } else if(operator === "inFolder:regexp"){
            Object.entries(snapshot.folders).forEach((key, value) => {
                if(key[0] === folderId){
                    let index = 0;
                    while(index < (Object.values(key[1]).length)){
                        let file = Object.values(key[1])[index];
                        if(!addedFilesSet.has(file.name)){
                            addedFilesSet.add(file.name);
                            filesAdded = filePassed;
                        }
                        fileForOperator = filePassed;
                        index += 1;
                    }
                }
            })
        } else if(operator === "folder:regexp"){
            Object.entries(snapshot.folders).forEach((key, value) => {
                if(key[0] === folderId){
                    let index = 0;
                    console.log(snapshot);
                    console.log(folderId);
                    console.log(filePassed);
                    while(index < (Object.values(key[1]).length)){
                        let file = Object.values(key[1])[index];
                        if(!addedFilesSet.has(file.name)){
                            addedFilesSet.add(file.name);
                            filesAdded = filePassed;
                            checkForSubFolders(snapshot, file.id, addedFilesSet);  // addedFiles was here.
                        }
                        fileForOperator = filePassed;
                        index += 1;
                    }
                }
            })
        }
        return [filesAdded, fileForOperator]
    }

    /**
     * helper function for "folder:regexp" query operator. This function checks to see if there
     * exists a sub folder which has files in it, that needs to be shown for the front end.
    */
    const checkForSubFolders = (snapshot, folderId, addedFilesSet, addedFiles) => {
        Object.entries(snapshot.folders).forEach((key, value) => {
            console.log(folderId);
            let setHere = new Set();
        
            setHere = addedFilesSet;
            if(key[0] === folderId){
                let index = 0;
                while(index < (Object.values(key[1]).length)){
                    let file = Object.values(key[1])[index];
                    console.log(file);
                    if(!setHere.has(file.name)){
                        setHere.add(file.name);
                        addedFiles.push(file);
                        checkForSubFolders(snapshot, file.id, addedFilesSet, addedFiles);
                    }
                    index += 1;
                }
            }
        })
        return addedFiles;
    }

    // writeable:jason.zhang.1@stonybrook.edu and owner:emirhan.akkaya@stonybrook.edu and name:pdf$ or 
    // (cont. ^)... from:varunvinay.chotalia@stonybrook.edu and to:emirhan.akkaya@stonybrook.edu
    const performSearch = useCallback (async (snapshot, queries, save, booleanOps) => {
        
        let set = new Set();
        console.log(queries);
        
        //writeable:jason.zhang.1@stonybrook.edu and owner:jason.guo@stonybrook.edu
        //name:^JJEV and owner:jason.guo@stonybrook.edu or from:varunvinay.chotalia@stonybrook.edu
        let queriesLength = 0;
        let keys = [];
        let values = [];
        queries.forEach((key, value) => {
            keys.push(key);
            values.push(value);
            queriesLength += 1;
        })
        let booleanIndex = queriesLength > 1 ? 0 : -1; // was >
        console.log(booleanIndex);
        console.log(booleanOps);
        console.log(queries);
        console.log(queriesLength);
       
        
        // name:^jjev and writeable:jason.zhang.1@stonybrook.edu
        
        let files = [];
        let saveTheseFiles = [];
        let filesToCompare = [];
        console.log(filesToCompare);
        let firstQuery = []; 
        let queriesIndex = 0;
        let saveOriginalQueries = new Map();
        let keyToDelete = null;

        for(let [key, value] of queries){
            // saveOriginalQueries.set(key, value);
            console.log("key: " + key + ", value: " + value);
            if(queriesIndex >= 2){ // delete one at a time to check the last index with the second to last index.
                break;
            }
            saveOriginalQueries.set(key, value);
            
            if(queriesIndex < 1){
                keyToDelete = key;
            }
            queries.delete(key);
            
            queriesIndex += 1;
        }
        
        queriesIndex = 0;
        let forBoolIndex = 0;
        let namesOfFiles = new Set();
        while(booleanIndex < booleanOps.length){
            
            let secondQuery = [];
            console.log(queries);
            console.log(Object.keys(queries));
            // if(Object.keys(queries).length <= 0 && queriesIndex === 7){
            //     break;
            // }
            console.log(Object.keys(queries)[0]);
            
            let queryIndex = 0;
            
            if(queriesIndex === 7){ // a flag (7 represents something specific).
                saveOriginalQueries.delete(keyToDelete)
                console.log(saveOriginalQueries);
                for(let [key, value] of queries){
                    console.log("queries:");
                    console.log(queries);
                    if(queryIndex < 1){
                        saveOriginalQueries.set(key, value);
                    }
                    if(queryIndex >= 1){ // delete one at a time to check the last index with the second to last index.
                        break;
                    }
                    queryIndex += 1;
                    keyToDelete = key;
                    queries.delete(key);
                }
            }
            //writeable:jason.zhang.1@stonybrook.edu and owner:jason.guo@stonybrook.edu or name:pdf$
            
            console.log(files);
            console.log(queries);
            console.log(booleanIndex);
            console.log(booleanOps.length);
            console.log(booleanOps[booleanIndex]);
            console.log(saveOriginalQueries);
            let lengthOfQueriesHere = 0;
            saveOriginalQueries.forEach((key, value) =>{
                lengthOfQueriesHere += 1;
            })
            //!name:Scala and owner:emirhan.akkaya@stonybrook.edu or writeable:jason.zhang.1@stonybrook.edu 
            // stuck on this one^ -> getting the "!" to work with other boolean operators.
            Object.values(snapshot.folders).forEach((folder) => {
                Object.values(folder).forEach((file) => {
                    let results = new Map();
                    let qFlag = 0;
                    if(queriesIndex === 7){
                        let indexHere = 0;
                        // firstQuery = [];
                        namesOfFiles.forEach((val) => {
                            firstQuery[indexHere] = val;
                            indexHere += 1;
                        })
                    }
                    saveOriginalQueries.forEach((key, value) => {
                        if(lengthOfQueriesHere === 1 && queriesIndex === 7) { 
                            qFlag = 1; 
                            // firstQuery = [];
                        } // can't put a nonsense restriction in this case.
                        else{
                            ;
                        }
                        // console.log(file); //name:^JJEV and owner:jason.guo@stonybrook.edu or sharing:none
                        //name:^JJEV and owner:jason.guo@stonybrook.edu or from:varunvinay.chotalia@stonybrook.edu
                        if(value === "inFolder:regexp"){
                            let regexp = new RegExp(key);
                            if(regexp.exec(file.name) && file.type === "folder"){ 
                                files = searchCheckFile(value, key, file, set, snapshot, file.id);
                            }
                        } else if(value === "folder:regexp"){
                            let regexp = new RegExp(key);
                            if(regexp.exec(file.name) && file.type === "folder"){ 
                                files = searchCheckFile(value, key, file, set, snapshot, file.id);
                            }
                        } else{
                            console.log("key: " + key + ", value: " + value);
                            let returnedFile = searchCheckFile(value, key, file, set, snapshot, "");
                            if(returnedFile[0]){
                                console.log("in heree?");
                                files.push(returnedFile[0]);
                                // filesSet.add(returnedFile[0]);
                                filesToCompare.push(returnedFile[0].id);
                                if(qFlag === 0){
                                    firstQuery.push(file.id);
                                }
                            }
                            if(returnedFile[1]){
                                console.log("qFlag: " + qFlag);
                                console.log(file);
                                if(qFlag === 1){//
                                    secondQuery.push(file.id);
                                }
                            }
                            
                            qFlag = 1; // even if file wasn't added, should still be "1" for qFlag for next query.
                        }
                       
                        // AND operator (checking if second operators array is in first operatros array)
                        
                        // let filesQueryIndex = 0;
                        // while(filesQueryIndex < filesQuery.length){
                        //     let checkDuplicatesIndex = filesQueryIndex;
                        //     let dupFlag = 0;
                        //     while(checkDuplicatesIndex < filesQuery.length){
                        //         if(filesQuery[checkDuplicatesIndex].id === files[checkDuplicatesIndex].id){
                        //             dupFlag = 1;
                        //             break;
                        //         }
                        //         checkDuplicatesIndex += 1;
                        //     }
                        //     if(dupFlag === 0){
                        //         files.push(filesQuery[filesQueryIndex]); // duplicate NON - EXISTENT
                        //     }
                        //     filesQueryIndex += 1;
                        // }
                        results.set(value, files);
                    })
                })
                // first = true;
            })
            queriesIndex = 7;

            console.log(firstQuery);
            console.log(secondQuery);
            console.log(booleanOps);
            
            let addedSet = new Set();
            // name:^JJEV and owner:jason.guo@stonybrook.edu or from:varunvinay.chotalia@stonybrook.edu
            // writeable:jason.zhang.1@stonybrook.edu and owner:emirhan.akkaya@stonybrook.edu and name:pdf$
            if(booleanOps[forBoolIndex] === "and"){
                let index = 0;
                let setHere = new Set();
                while(index < firstQuery.length){ setHere.add(firstQuery[index++]); }
                index = 0;
                while(index < secondQuery.length){
                    if(setHere.has(secondQuery[index])){
                        addedSet.add(secondQuery[index]);
                    }
                    index += 1;
                }
                // name:^jjev and owner:emirhan.akkaya@stonybrook.edu
                // name:pdf$ and owner:scott.stoller@stonybrook.edu and sharing:none
                index = 0;
                console.log(addedSet);
                saveTheseFiles = [];
                Object.values(snapshot.folders).forEach((folder) => {
                    Object.values(folder).forEach((file) => {
                        if(addedSet.has(file.id)){
                            saveTheseFiles[index] = file;
                            namesOfFiles[index] = file.id;
                            index += 1;
                        }
                    })
                })
            } else if(booleanOps[forBoolIndex] === "or"){
                // name:^jjev and owner:emirhan.akkaya@stonybrook.edu
                let index = 0;
                let setToAdd = new Set();
                while(index < firstQuery.length){ setToAdd.add(firstQuery[index++]); }
                index = 0;
                while(index < secondQuery.length){ setToAdd.add(secondQuery[index++]); }
                index = 0;
                console.log(setToAdd);
                saveTheseFiles = [];
                namesOfFiles = [];
                console.log(saveTheseFiles); // make "saveTheseFiles" a set and then push onto an array at the end.
                
                Object.values(snapshot.folders).forEach((folder) => {
                    Object.values(folder).forEach((file) => {
                        if(setToAdd.has(file.id)){
                            saveTheseFiles[index] = file;
                            namesOfFiles[index] = file.id;
                            index += 1;
                        }
                    })
                })
                console.log(saveTheseFiles);
            } else if(booleanOps[forBoolIndex] === "!"){
                saveTheseFiles = [];
                console.log(saveTheseFiles);
                namesOfFiles = [];
                let index = 0;
                console.log(firstQuery);
                addedSet = new Set();
                while(index < firstQuery.length){
                    addedSet.add(firstQuery[index]);
                    index += 1;
                }
                console.log(addedSet);
                index = 0;
                Object.values(snapshot.folders).forEach((folder) => {
                    Object.values(folder).forEach((file) => {
                        if(addedSet.has(file.id)){
                            console.log("has it");
                            console.log(file);
                        }
                        else{
                            saveTheseFiles[index] = file;
                            namesOfFiles[index] = file.id; // fixme
                            index += 1;
                        }
                    })
                })
            } else{ // one query operator.
                if(booleanOps.length > 0){
                    break; // then there could've been a "!" from which we already saved some files.
                }
                let index = 0;
                while(index < files.length){
                    saveTheseFiles[index] = files[index];
                    namesOfFiles[index] = files[index].id; // fixme
                    index += 1;
                }
            }
            console.log(namesOfFiles);
            console.log(saveTheseFiles);
            booleanIndex += 1;
            forBoolIndex += 1;
        }
        
        if (save) {
            setSearchResults(saveTheseFiles)
        }
        else {
            return saveTheseFiles;
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
            getControlReqQueryFiles, checkInDomains, checkViolations, checkReqsBeforeUpdate, getDeviantFiles
        }}>
            {props.children}
        </UserContext.Provider>
    );
    
}

export default UserContextProvider;