import React, { createContext } from "react";
import api from '../../api/ShareManagerAPI'

export const UserContext = createContext({});

function UserContextProvider(props) {

    const createUser = async (userInfo) => {
        try {
            const response = await api.createUser(userInfo);
            if (response.status === 200) {

            }
        }
        catch (err) {
            console.error(err.response.data.errorMessage);
        }
    }

    const loginUser = async (loginInfo) => {
        try {
            const response = await api.loginUser(loginInfo);
            if (response.status === 200) {

            }
        }
        catch (err) {
            console.error(err.response.data.errorMessage);
        }
    }

    const testConnect = async () => {
        try {
            const response = await api.testConnect();
            if (response.status === 200) {
                console.log(response)
            }
        }
        catch (err) {
            console.error(err.response.data.errorMessage);
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