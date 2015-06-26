var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var readline = require('readline');
var fs = require('fs');
var request = require('request');
var parseString = require('xml2js').parseString;
var User = require('../models/User');
var GoogleOauthToken = require('../models/GoogleOauthToken');
var env = process.env.NODE_ENV || 'development'
var config = require('../config')[env];
var googleClientId = process.env.GOOGLE_CLIENT_ID || config.googleClientId;
var googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || config.googleClientSecret;
var googleRedirectUrl = process.env.GOOGLE_REDIRECT_URL || config.googleRedirectUrl;

// Client ID and client secret are available at
// https://code.google.com/apis/console
var oauth2Client = new OAuth2Client(googleClientId, googleClientSecret, googleRedirectUrl);
google.options({ auth: oauth2Client });


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getAccessToken(oauth2Client, callback) {

  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    approval_prompt: 'force', // force the return of refresh_tokens
    scope: 'https://picasaweb.google.com/data/'
  });

  console.log('Visit the url: ', url);
  rl.question('Enter the code here:', function(code) {
    // request access token
    oauth2Client.getToken(code, function(err, tokens) {
      // set tokens to the client
      console.log('tokens => ' + JSON.stringify(tokens));
      oauth2Client.setCredentials(tokens);
      callback(tokens);
    });
  });
}

//todo
function requestAccess(userId, callback) {
  var oauthUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://picasaweb.google.com/data/'
  });

  request({
    method: 'GET',
    uri: oauthUrl + '?userid=' + userId
  }, callback);
}

//todo
function getTokenFromCode(userId, code) {
  oauth2Client.getToken(code, function(err, tokens) {
    oauth2Client.setCredentials(tokens);

    User.findOne({_id: userId}, function(err, userFromDb) {
      if (err) {
        callback({
          err: "Error occurred: " + err
        });
      } else {
        //userFromDb.gdataAccessToken = tokens.access_token;
        userFromDb.save();
      }
    });

    callback(tokens);
  });
}

function upload(fileName, options, callback) {
  fs.readFile(fileName, function(error, data) {
    if (error) {
      callback(error, null, null);
    }
    else {
      console.log('Read file', data.length);

      var token = options.token;
      var userId = options.userId || 'default';
      var rootUrl = 'https://picasaweb.google.com/data/feed/api/user/'+
        userId+'/albumid/'+
        options.albumId+'';

      request({
        method:'POST',
        headers:{
          'GData-Version': '2',
          'Authorization':'Bearer' + ' ' + token,
          "Content-Type":'image/jpeg',
          'Content-Length':data.length,
          "MIME-version":"1.0"},
        body:data,
        uri:rootUrl
      }, callback);
    }
  });
}

module.exports = {
  requestAccess: requestAccess,
  getTokenFromCode: getTokenFromCode,
  uploadPicture: function(userId, callback) {

    User.findOne({_id: userId}, function(err, user) {
      if (err) {
        //todo - use promise reject
        callback(err);
      } else {

        GoogleOauthToken.findOne({user_id: userId}, function(err, tokens) {
          if (err) {
            console.log("error!! => " + err);
          }
          oauth2Client.setCredentials(tokens);

          oauth2Client.getRequestMetadata(null, function(err, headers, response) {
            if (err) {
              console.log("error getting token => " + err);
            }

            // update access token data for user
            tokens.access_token = oauth2Client.credentials.access_token;
            tokens.expiry_date = oauth2Client.credentials.expiry_date;
            tokens.save();

            upload('/Users/v733647/Downloads/IMG_5054.jpg', {
              albumId: user.picassawebAlbumId,
              userId: user.picassawebUserId,
              token: oauth2Client.credentials.access_token
            }, function(error, response, body) {
              if (body && (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 202)) {
                parseString(body, function (err, result) {
                  if (!err) {
                    callback(result.entry['media:group'][0]['media:content'][0].$.url);
                  }
                  else {
                    console.error('Error', err);
                  }
                });
              }
              else {
                console.error('Error', response.statusCode, body);
              }
            });

          });


        });
        //getAccessToken(oauth2Client, function(tokens) {


        //});

      }
    });

    //album id in picasa
    /*var albumId = '6161803355519338577';
    var userId = 'rich.beaver';

    getAccessToken(oauth2Client, function(tokens) {

      upload('/Users/v733647/Downloads/IMG_5054.jpg', {
        albumId: albumId,
        userId: userId,
        token: tokens.access_token
      }, function(error, response, body) {
        if (body && (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 202)) {
          parseString(body, function (err, result) {
            if (!err) {
              callback(result.entry['media:group'][0]['media:content'][0].$.url);
            }
            else {
              console.error('Error', err);
            }
          });
        }
        else {
          console.error('Error', response.statusCode, body);
        }
      });

      *//*fs.readFile('/Users/v733647/Downloads/IMG_5054.jpg',"base64",function(error,data){
        var userId= userId || 'default';
        var rootUrl='https://picasaweb.google.com/data/feed/api/user/'+userId+'/albumid/'+albumId+'';
        var body_data=gen_multipart('testing.jpg','sss',data,'image/jpeg');
        request({
          method:'POST',
          headers:{ 'GData-Version': '2','Authorization':'Bearer' + ' ' + 'my_access_token',"Content-Type":'multipart/related; boundary="END_OF_PART"','Content-Length':body_data.length,"MIME-version":"1.0"},
          body:body_data,
          uri:rootUrl
        }, function(response) {
          console.log(response);
          callback(response);
        });
      });*//*
    });*/



  }
};
