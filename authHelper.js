// Get credentials from https://apps.dev.microsoft.com/#/appList
// Reference video: https://www.youtube.com/watch?v=Sx46yCYPsek

var clientId = 'd022168a-4776-4e2e-a507-fc09835246ec';
var clientSecret = 'Soe7Q~itZP6vSRjAu5h13t8zE~lfHxxSAsC-L';
var redirectUri = 'http://localhost:3000/authorize';
var tenantId = '850aa78d-94e1-4bc6-9cf3-8c11b530701c';

var scopes = [
    'openid',
    'email',
    'profile',
    'user.read',
    'offline_access',
    'https://outlook.office.com/calendars.read'
];

// https://login.microsoftonline.com/850aa78d-94e1-4bc6-9cf3-8c11b530701c/oauth2/v2.0/authorize?client_id=d022168a-4776-4e2e-a507-fc09835246ec&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauthorize&response_mode=query&scope=openid


// var credentials = {
//     clientID: clientId,
//     clientSecret: clientSecret,
//     site: 'https://login.microsoftonline.com/common',
//     tokenPath: '/oauth2/v2.0/token'
// }
// var oauth2 = require('simple-oauth2').create(credentials);

const {AuthorizationCode} = require('simple-oauth2');
const oauth2 = new AuthorizationCode({
        client: {
          id: clientId,
          secret: clientSecret
        },
        auth: {
            tokenHost: 'https://login.microsoftonline.com',
            authorizePath: "common/oauth2/v2.0/authorize",
            tokenPath: "common/oauth2/v2.0/token",
        }
      });

module.exports = {
    getAuthUrl: function(){
        var returnVal = oauth2.authorizeURL({
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: scopes.join(' '),
        });
        console.log(' ');
        console.log('Generated auth url: ' + returnVal);
        return returnVal;
    },

    getTokenFromCode: async function(authCode, callback, request, response) {

        var tokenParams = {
            code: authCode,
            redirect_uri: redirectUri,
            scope: scopes.join(' ')
        };

        try{
            var access_token = await oauth2.getToken(tokenParams);
            console.log(' ');
            console.log('Token created: ' + access_token.token);
            callback(request, response, null, access_token);
        }
        catch(error){
            console.log('Access Token error: ' + error);
            callback(request, response, error, null);
        }

        // oauth2.getToken({
        //     code: authCode,
        //     redirect_uri: redirectUri,
        //     scope: scopes.join(' '),
        //     function(error, result) {
        //         if(error){
        //             console.log('Access token error: ' + error.message);
        //             callback(request, response, error, null);
        //         }
        //         else{
        //             var token = oauth2.accessToken.create(result);
        //             console.log(' ');
        //             console.log('Token created: ' + token.token);
        //             callback(request, response, null, token);
        //         }
        //     }
        // });
    },

    getInformationFromIdToken: function(id_token) {
        console.log(' ');
        console.log(id_token);
        var token_parts = id_token.split('.');
        var encoded_token = new Buffer(token_parts[1].replace('-', '+').replace('_', '/'), 'base64');
        var decoded_token = encoded_token.toString();
        console.log('\n' + decoded_token);
        var jwt = JSON.parse(decoded_token);
        console.log(jwt);
        var information = [jwt.preferred_username, jwt.name];
        return information;
    },

    getTokenFromRefreshToken: function(refresh_token, callback, request, response){

    }
}