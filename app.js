const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require ('path');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
router = express.Router();
const dotenv = require('dotenv');
const util = require('util')

// app.use(dotenv.config());
var port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//specify the roots static
//resodre les url des fichiers img in express 
app.use(express.static("uploads"))
// define routes
const bdd = require("./model/database");
const user = require('./routes/user').init(bdd)
const post = require("./routes/post").init(bdd);

bdd.q = util.promisify(bdd.query)//tranfform the methode query into promise

app.use("/user", user);
app.use("/post", post);

app.listen(port, () => {
    console.log('Server started on port', port);
});