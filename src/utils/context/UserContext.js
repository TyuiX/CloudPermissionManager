import React, { createContext } from "react";
import api from '../../api/ShareManagerAPI'

export const UserContext = createContext({});

function UserContextProvider(props) {

    const createUser = async (userInfo) => {
        try {
            const res = await api.createUser(userInfo);
            if (res.status === 200) {

            }
        }
        catch (err) {
            console.error(err.res.data.errorMessage);
        }
    }

    const loginUser = async (loginInfo) => {
        try {
            const res = await api.loginUser(loginInfo);
            if (res.status === 200) {

            }
        }
        catch (err) {
            console.error(err.res.data.errorMessage);
        }
    }

    const testConnect = async () => {
        try {
            const res = await api.testConnect();
            if (res.status === 200) {
                console.log(res)
            }
        }
        catch (err) {
            console.error(err.res.data.errorMessage);
        }
    }

    return (
        <UserContext.Provider value={{
            createUser, loginUser, testConnect
        }}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;