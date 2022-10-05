import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import api from '../../api/ShareManagerAPI'
import {useNavigate} from "react-router-dom";
import {UserContext} from "./UserContext";
import {gapi} from "gapi-script";
import googleAuth from "../GoogleAuth";
import {getFiles} from "../../api/GoogleAPI";

export const GoogleContext = createContext({});

function GoogleContextProvider(props) {
    const [files, setFiles] = useState([])
    const { loggedIn } = useContext(UserContext)

    useEffect(() => {
        if (!loggedIn) {
            return
        }
        const start = () => {
            gapi.client.init(googleAuth).then(async () => {
                    let files = await getFiles()
                    // console.log(files);
                    let reformattedFiles = []
                    files.forEach(({id, name, mimeType}) => {
                        let type;
                        switch (mimeType) {
                            case "application/vnd.google-apps.folder":
                                type = "folder";
                                break;
                            default:
                                type = "file";
                        }
                        reformattedFiles.push({
                            name: name,
                            id: id,
                            type: type,
                        })
                    });
                    console.log(reformattedFiles);
                    setFiles(reformattedFiles)
                }
            )
        }
        gapi.load('client:auth2', start)
    }, [loggedIn])

    return (
        <GoogleContext.Provider value={{
            files
        }}>
            {props.children}
        </GoogleContext.Provider>
    );
}

export default GoogleContextProvider;