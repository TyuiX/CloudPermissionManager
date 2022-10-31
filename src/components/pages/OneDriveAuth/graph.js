import { graphConfig } from "./authConfig";

/**
 * Attaches a given access token to a Microsoft Graph API call. Returns information about the user
 */
export async function callMsGraph(accessToken) {
    const headers = new Headers({'Authorization': 'Bearer ' + accessToken,'Content-Type': 'application/json; charset=UTF-8',});
    // const bearer = `Bearer ${accessToken}`;

    // headers.append("Authorization", bearer);

    const options = {
        // mode: 'no-cors',
        // dataType: "jsonp",
        method: "GET",
        headers: headers
    };

    if(graphConfig.graphMeEndpoint === undefined){
        console.log("is undefined");
    }

    let id = "";
    return fetch(graphConfig.graphMeEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error)).then(e => {
            fetch("https://graph.microsoft.com/v1.0/me/drive/root/children", {
                // dataType: "jsonp",
                method: "GET",
                headers: headers
            }).then(res => {
                console.log(res.json().then(function(data) {
                    console.log(data);
                  }));
            }).catch(err => {
                console.log(err); 
            })
            id = e.id;
            console.log(e);
        });
}

// function callMSGraph(endpoint, token, callback) {
//     const headers = new Headers();
//     const bearer = `Bearer ${token}`;
  
//     headers.append("Authorization", bearer);
  
//     const options = {
//         method: "GET",
//         headers: headers
//     };
  
//     console.log('request made to Graph API at: ' + new Date().toString());
  
//     fetch(endpoint, options)
//       .then(response => response.json())
//       .then(response => callback(response, endpoint))
//       .catch(error => console.log(error))
//   }