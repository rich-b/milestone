/*
var Flickr = require("flickrapi");
var flickrOptions = {
  api_key: '5a6da127d30afbfedff3de256cfcdc7b',
  secret: '77bbbcc6552d3f1a',
  permissions: 'write',
  progress: false,
  callback: encodeURIComponent('http://localhost:3000/flickr-verify/'),
  //callback: 'http://stuffs.com/flickr-verify/',

  user_id: 'rcbeav'
};

module.exports = {
  getPictures: function() {
    Flickr.authenticate(flickrOptions, function(error, flickr) {

      flickr.photos.search({
        user_id: flickr.options.user_id,
        page: 1,
        per_page: 20
      }, function(err, result) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(result);
        }
      });

    });
  },
  setUserAccessTokens: function(verificationResponse) {
    console.log(verificationResponse);

    flickrOptions.exchange = verificationResponse;

  }
};*/
