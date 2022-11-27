const { mongoDB } = require("../config/mongo.config")
const mongoose = require('mongoose')
const Schema = mongoose.Schema
var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
const mongoosedb = mongoose.connect(mongoDB, options);

const image_metadata = mongoose.model('image_metadata', new Schema({
        tag: { type: String },
        name: { type: String },
    },
    {
        versionKey: false
    },
    {
        collection:'image_metadata'
    }
),'image_metadata');

module.exports = {mongoosedb, image_metadata};