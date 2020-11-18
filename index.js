const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressSession = require('express-session');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(expressSession({
    name: "battleshipCookie",
    secret: "comp426",
    resave: false,
    saveUninitialized: false
}));

const usersApi = require('./users.js');
app.use('/api', usersApi);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});