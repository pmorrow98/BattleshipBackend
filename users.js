const express = require('express');
const router = express.Router()

const UserProfile = require('./UserProfile');

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
            if(result == null) {
                res.status(404).send("Not found");
                return;
            }

            if(result.password == password) {
                req.session.user = username;
                res.json(true);
                return;
            } 

            res.json(false);
            
        }).catch(error => console.error(error));
    });

    router.get('/logout', (req, res) => {
        delete req.session.user;
        res.json(true);
    });

    // Create new user
    router.post('/user', (req, res) => {
        let {username, password} = req.body;
    
        let user = new UserProfile(username, password);

        if (user == null) {
            res.status(400).send("Bad Request");
            return;
        }
    
        userCollection.insertOne(user).then(result => {
            res.json(true);
            return;
          }).catch(error => console.error(error));
    });

    // Get all user profiles
    router.get('/user', (req, res) => {
        /* if (req.session.user == undefined) {
            res.status(403).send("Unauthorized");
            return;
        } */

        userCollection.find().toArray().then(result => {
            res.json(result);
            return;
        }).catch(error => console.error(error));
    });

    // Get user profile by username
    router.get('/user/:username', (req, res) => {
        /* if (req.session.user == undefined) {
            res.status(403).send("Unauthorized");
            return;
        } */

        const username = req.params.username;

        userCollection.findOne({username: username}).then(result => {
            if (result == null) {
                res.status(404).send("Not found");
                return;
            }

            res.json(result);
        }).catch(error => console.error(error));
    });

    // Delete profile by username
    router.delete('/user/:username', (req, res) => {
        /* if (req.session.user == undefined) {
            res.status(403).send("Unauthorized");
            return;
        } */

        const username = req.params.username;

        userCollection.deleteOne({username: username}).then(result => {
            res.json(true);
            return;
        }).catch(error => console.error(error));
    });

    // Update user profile
    router.put('/user/:username', (req, res) => {
        /* if (req.session.user == undefined) {
            res.status(403).send("Unauthorized");
            return;
        } */

        const user = req.params.username;

        userCollection.findOne({username: user}).then(result => {
            if (result == null) {
                res.status(404).send("Not found");
                return;
            }

            let {username, password, wins, losses, shipsSunk, gamesPlayed} = req.body;
            
            if(username != null) {
                result.username = username;
            }
            if(password != null) {
                result.password = password;
            }
            if(gamesPlayed != null) {
                result.gamesPlayed = gamesPlayed;
            }
            if(wins != null) {
                result.wins = wins;
            }
            if(losses != null) {
                result.losses = losses;
            }
            if(shipsSunk != null) {
                result.shipsSunk = shipsSunk;
            }

            let updated = result;

            userCollection.updateOne({username: user}, {$set: updated}).then(result => {
                res.json(updated);
                return;
            }).catch(error => console.log(error));

        }).catch(error => console.error(error));
    });

  }).catch(error => console.error(error));

module.exports = router;