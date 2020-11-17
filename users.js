const express = require('express');
const router = express.Router()

const UserProfile = require('./UserProfile');

const expressSession = require('express-session');

router.use(expressSession({
    name: "battleshipCookie",
    secret: "comp426",
    resave: false,
    saveUninitialized: false
}));

const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://battleship:comp426@cluster0.fqc7a.mongodb.net/<dbname>?retryWrites=true&w=majority';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');

    const db = client.db("battleship");
    const userCollection = db.collection('users');

    router.post('/login', (req, res) => {
        let {username, password} = req.body;

        userCollection.findOne({username: username}).then(result => {
            if(result.password == password) {
                console.log("Logged in!");
                req.session.user = username;
                console.log(req.session.user);
                res.json(true);
                return;
            } else {
                res.status(403).send("Unauthorized");
            }
        }).catch(error => console.error(error));
    });

    // Create new user
    router.post('/user', (req, res) => {
        let {username, password} = req.body;
    
        let user = new UserProfile(username, password);
    
        userCollection.insertOne(user).then(result => {
            console.log(result)
          }).catch(error => console.error(error));
    });

    // Get all user profiles
    router.get('/user', (req, res) => {
        userCollection.find().toArray().then(result => {
            console.log(req.session.user);
            res.json(result);
        }).catch(error => console.error(error));
    });

    // Get user profile by username
    router.get('/user/:username', (req, res) => {
        const username = req.params.username;

        userCollection.findOne({username: username}).then(result => {
            console.log(result)
        }).catch(error => console.error(error));
    });

    // Delete profile by username
    router.delete('/user/:username', (req, res) => {
        const username = req.params.username;

        userCollection.deleteOne({username: username}).then(result => {
            console.log(result)
        }).catch(error => console.error(error));
    });

    // Update user profile
    router.put('/user/:username', (req, res) => {
        const username = req.params.username;

        userCollection.updateOne({username: username}, {$set: new UserProfile("carson is soft", "peter is genius")}).then(result => {
            console.log("success")
        }).catch(error => console.log(error));
    });

  }).catch(error => console.error(error));


module.exports = router;
