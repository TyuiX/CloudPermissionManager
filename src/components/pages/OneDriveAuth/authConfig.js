export const msalConfig = {
    auth: {
      clientId: "44ec3610-ed81-4378-8e83-02bf58a0c022",
      authority: "https://login.microsoftonline.com/common", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
      redirectUri: "http://localhost:3000/files",
    }
    ,cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
   scopes: ["User.Read", "Files.Read", "Files.Read.All", "Files.Read.Selected", "Files.ReadWrite", "Files.ReadWrite.All", "Files.ReadWrite", "Files.ReadWrite.All", "Files.ReadWrite.AppFolder", "Files.ReadWrite.Selected"]
  };
  
  // Add the endpoints here for Microsoft Graph API services you'd like to use.
  export const graphConfig = {
      graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
  };

  // const {Client} = require("@microsoft/microsoft-graph-client");
  // const {TokenCredentialAuthenticationProvider} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
  // const {AuthorizationCodeCredential} = require("@azure/identity");

  // export const credential = new AuthorizationCodeCredential(
  //     "f729dc92-7f20-4c3a-a702-208d6bb1299c",
  //     "44ec3610-ed81-4378-8e83-02bf58a0c022",
  //     "http://localhost:3000/files"
  // );
  // export const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  //     scopes: [scopes]
  // });