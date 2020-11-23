const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressSession = require('express-session');
const app = express();

app.use(bodyParser.json());

let corsOptions = {
    origin: 'https://pmorrow98.github.io',
    credentials: true,
}

app.use(cors(corsOptions));
app.enable('trust proxy');
app.use(expressSession({
    name: "battleshipComp426",
    secret: "express session secret",
    cookie: { secure: false },
    resave: false,
    saveUninitialized: true
}));

// const usersApi = require('./users.js');
// app.use('/api', usersApi);

const UserProfile = require('./UserProfile');

const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://battleship:comp426@cluster0.fqc7a.mongodb.net/<dbname>?retryWrites=true&w=majority';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');

    const db = client.db("battleship");
    const userCollection = db.collection('users');

    app.post('/api/login', (req, res) => {

        let {username, password} = req.body;

        userCollection.findOne({username: username}).then(result => {
            if(result == null) {
                res.status(404).send("Not found");
                return;
            }

            if(result.password == password) {
                req.session.user = result.username;
                console.log("Login success: ");
                console.log(req.session);
                res.json(true);
                return;
            } 

            res.json(false);
            
        }).catch(error => console.error(error));
    });

    app.get('/api/logout', (req, res) => {
        delete req.session.user;
        res.json(true);
    });

    // Create new user
    app.post('/api/user', (req, res) => {
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
    app.get('/api/user', (req, res) => {
        userCollection.find().toArray().then(result => {

            //filter out passwords from returned data
            let returnArray = result.map(user => user.data);

            res.json(returnArray);
            return;
        }).catch(error => console.error(error));
    });

    // Get user profile by username
    app.get('/api/user/:username', (req, res) => {
        console.log("GET user: ");
        console.log(req.session);
        if (req.session.user == undefined) {
            res.status(403).send("Unauthorized");
            return;
        } 

        const username = req.params.username;

        userCollection.findOne({username: username}).then(result => {
            if (result == null) {
                res.status(404).send("Not found");
                return;
            }

            res.json(result.data);
        }).catch(error => console.error(error));
    });

    // Delete profile by username
    app.delete('/api/user/:username', (req, res) => {
        if (req.session.user == undefined) {
            res.status(403).send("Unauthorized");
            return;
        }

        const username = req.params.username;

        userCollection.deleteOne({username: username}).then(result => {
            res.json(true);
            return;
        }).catch(error => console.error(error));
    });

    // Update user profile
    app.put('/api/user/:username', (req, res) => {
        if (req.session.user == undefined) {
            res.status(403).send("Unauthorized");
            return;
        }

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
                result.data.gamesPlayed = gamesPlayed;
            }
            if(wins != null) {
                result.data.wins = wins;
            }
            if(losses != null) {
                result.data.losses = losses;
            }
            if(shipsSunk != null) {
                result.data.shipsSunk = shipsSunk;
            }

            let updated = result;

            userCollection.updateOne({username: user}, {$set: updated}).then(result => {
                res.json(updated);
                return;
            }).catch(error => console.log(error));

        }).catch(error => console.error(error));
    });

  }).catch(error => console.error(error));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});