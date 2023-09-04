const { Schema, model } = require("mongoose")

const Document = new Schema({
  _id: String, 
  name:String,
  data: Object,
  createdBy: String,
  createdAt: String,
  lastModified: String,
})

module.exports = model("Document", Document)
