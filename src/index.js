import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter} from "react-router-dom";
import UserContextProvider from "./utils/context/UserContext";
import GoogleContextProvider from "./utils/context/GoogleContext";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./components/pages/OneDriveAuth/authConfig";
import OneDriveContextProvider  from './utils/context/OneDriveContext';

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <UserContextProvider>
              <GoogleContextProvider>
                    <MsalProvider instance={msalInstance}>
                        <OneDriveContextProvider>
                            <App />
                        </OneDriveContextProvider>
                    </MsalProvider>
              </GoogleContextProvider>
          </UserContextProvider>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
