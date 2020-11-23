const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressSession = require('express-session');
const app = express();

app.use(bodyParser.json());

let corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}

app.use(cors(corsOptions));
app.enable('trust proxy');
app.use(expressSession({
    name: "battleshipComp426",
    secret: "express session secret",
    proxy: true,
    cookie: { secure: true, sameSite: 'none'},
    resave: false,
    saveUninitialized: false,
}));

const usersApi = require('./users.js');
app.use('/api', usersApi);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});