class UserProfile {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.wins = 0;
        this.losses = 0;
        this.shipsSunk = 0;
    }
}

module.exports = UserProfile;