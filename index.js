const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const app = express();

app.use(bodyParser.json());

let corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,
}

app.use(cors(corsOptions));
app.enable('trust proxy');
app.use(expressSession({
    name: "battleshipComp426",
    secret: "express session secret",
    cookie: { secure: false},
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({url: 'mongodb+srv://battleship:comp426@cluster0.fqc7a.mongodb.net/battleship?retryWrites=true&w=majority'})
}));

const usersApi = require('./users.js');
app.use('/api', usersApi);

const UserProfile = require('./UserProfile');

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});