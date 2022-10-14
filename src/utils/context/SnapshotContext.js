import { getSnapshots, getUserProfile } from '../../api/ShareManagerAPI';
import React, {createContext, useEffect, useState} from "react";

export const SnapshotContext = createContext({});

function SnapshotContextProvider(props){
    const [snapshots, setSnap] = useState([]);
    console.log("in snap cont");

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
        console.log("in snapcont use eff");
        getProfile().then(res => {
            getSnap(res.data.snapshot).then(res2 => {
                setSnap(res2);
            })
        });
        // event.handleGetFile();
        // console.log("in use effect");
        // console.log(snapshots);
    }, []);

    return (
        <SnapshotContext.Provider value={{
            snapshots
        }}>
            {props.children}
        </SnapshotContext.Provider>
    );
}
export default SnapshotContextProvider;