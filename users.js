const express = require('express');
const router = express.Router()

const UserProfile = require('./UserProfile');

router.get('/', (req, res) => {
    res.json(true);
});


module.exports = router;
