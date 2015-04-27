var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MilestoneSchema   = new Schema({
  id: Schema.ObjectId,
  type: String,
  title: String,
  date: { type: Date, default: Date.now },
  description: String,
  images: [{
    src: String,
    title: String,
    isDefault: Boolean,
    tags: String
  }]
});

module.exports = mongoose.model('Milestone', MilestoneSchema);