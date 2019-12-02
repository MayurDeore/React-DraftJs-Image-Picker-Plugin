var express = require('express');
var server = express();
var cors = require('cors');

server.use(cors());
const path = require("path")
const fs = require("fs")
console.log(__dirname);
const directoryPath = path.join(__dirname, "uploads")

server.get('/directory', (req, res) => {


    try {
        let directoryList = [];
        fs.readdir(directoryPath, function(err, files) {

            if (err) {
                console.log("Error getting directory information.")
            } else {
                directoryList = files;
                res.send(directoryList);
                res.end();
            }
        })

    } catch (error) {
        res.send(error);
        res.end();
    }
})
server.use(express.static(__dirname + '/uploads'));

server.listen(5000);