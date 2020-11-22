class UserProfile {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.data = {
            username: username,
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            shipsSunk: 0
        }
    }
}

module.exports = UserProfile;