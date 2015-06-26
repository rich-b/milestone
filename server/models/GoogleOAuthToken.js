var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GoogleOauthTokenSchema = new Schema({
  user_id: Schema.ObjectId,
  access_token: String,
  token_type: String,
  refresh_token: String,
  expiry_date: Number
}, {
  collection: 'googleOauthTokens'
});

module.exports = mongoose.model('GoogleOauthToken', GoogleOauthTokenSchema);