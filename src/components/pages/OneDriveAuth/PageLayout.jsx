import React from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton"

/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();

    // const handleClick = () =>{
    //     if(isAuthenticated){
            
    //     }
    // }

    return (
        <>
            { isAuthenticated ? <SignOutButton /> : <SignInButton /> }
            {/* <button onClick={handleClick}>Get file</button> */}
            {props.children}
        </>
    );
};