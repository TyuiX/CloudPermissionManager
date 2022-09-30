/* global gapi */
import React from 'react';

const axios = require('axios');

export default class CloudSharingManager extends React.Component {
  constructor(props){
    super(props);
    this.state = {pageNumber: 0}
  }

  onSignIn(googleUser) {
    console.log("here");
    var profile = googleUser.getBasicProfile();
    
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

  componentDidMount(){ 
    axios.get('http://localhost:8000/login').then(resp => {
        this.state.pageNumber = 1;
    });
  }

  render(){
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    // script.async = true;
    document.body.appendChild(script);


    return (
        <>
        <head>
        <meta name="google-signin-client_id" content="1064952808879-jet065pvd33m0mrbei3nn64kuchj6qc8.apps.googleusercontent.com"></meta>
        </head>
        
        <body>
            <h1>Login</h1> 
            <div className="g-signin2" data-onsuccess={this.onSignIn}>Link Account</div>
  
            <a href="#" onClick={this.signOut}>Sign out</a>
            <script>
                
            </script>
        </body>

        </>
    );
  }
}