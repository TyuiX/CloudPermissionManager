import React, {createContext, useCallback, useEffect, useState} from "react";
import api from '../../api/ShareManagerAPI'
import {useNavigate} from "react-router-dom";

export const UserContext = createContext({});

function UserContextProvider(props) {
    const [user, setUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
            setLoggedIn(true)
        }
    }, []);

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
            user, loggedIn, createUser, loginUser, logoutUser, testConnect
        }}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;