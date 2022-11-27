const express = require("express");
const app = express();
const PORT = 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const async = require('async');
const path = require('path');

//------- mongoose ------
const { mongoosedb, image_metadata } = require('./models/data-model');
mongoosedb;
//---------

const AWS = require("aws-sdk");
app.use(cors());


app.get("/getImages", (req, res) => {
  AWS.config.update({
    accessKeyId: "Access Key",
    secretAccessKey: "Secret Key",
  });

  let s3 = new AWS.S3();

  async function getImage() {
    
    const data = s3
      .listObjects({
        Bucket: "assignmentimages"
      })
      .promise();
    return data
  }
  getImage()
    .then(async (img) => {
      const arr = [];
      async.eachSeries(img.Contents, function (element, cb) {
        const file = element.Key.split('.');
         image_metadata.findOne({ name: file[0].toLowerCase() },function(err,doc){
          if(err){
            cb();
          }else{
            
            element.metadata = doc.tag;
            arr.push(element)
            cb();
          }
        });
        
      }, function (err) {
        if (err) {
          res.json({ "status": "failure", "message": err });
        } else {
          res.json({ "status": "success", "msg": arr });
        }
      })

     
    })
    .catch((e) => {
      res.send(e);
    });
});

const __dirname = path.dirname('')
const buildPath = path.join(__dirname, "../Frontend/build")

app.use(express.static(buildPath))

app.get("/", function(req, res){
  res.sendFile(
    path.join(__dirname, "../Frontend/build/index.html"),
    function(err){
      if(err){
        res.status(500).send(err);
      }
    }
  );
})

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Web Server running on port ${PORT}`);
    console.log("connected to mongoDB")
  });
})