const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schemaaa= new Schema({
    adminid : {
        type: Schema.Types.ObjectId,
        ref: 'admin'
    },
    offer_photo:{
        name: String,
        data: Buffer,
        contentType: String,
      },

}, { timestamps: true });

module.exports = mongoose.model("adminsetoffer" , schemaaa);