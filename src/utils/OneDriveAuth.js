const {
    Client
} = require("@microsoft/microsoft-graph-client");
const {
    TokenCredentialAuthenticationProvider
} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const {
    AuthorizationCodeCredential
} = require("@azure/identity");

const credential = new AuthorizationCodeCredential(
    "f729dc92-7f20-4c3a-a702-208d6bb1299c",
    "44ec3610-ed81-4378-8e83-02bf58a0c022",
    "<AUTH_CODE_FROM_QUERY_PARAMETERS>",
    "http://localhost:3000/files"
);
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: [scopes]
});