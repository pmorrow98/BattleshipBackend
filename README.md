# BattleshipBackend
- Login:
  - POST https://battleshipcomp426.herokuapp.com/api/login
  - Request Params:
    - username (string)
    - password (string)
  - Response: Responds with true upon a successful login, false for incorrect password, and a 404 error is user does not exist.
  
- Logout:
  - GET https://battleshipcomp426.herokuapp.com/api/logout
  - Request Params: None
  - Response: Responds with true upon a successful logoff.
  
- Create New User Profile:
  - POST https://battleshipcomp426.herokuapp.com/api/user
  - Request Params:
    - username (string)
    - password (string)
  - Response: Responds with true upon successful creation.

- Get All User Profiles:
  - GET https://battleshipcomp426.herokuapp.com/api/user
  - Request Params: None
  - Response: Responds with an array in JSON format containing all the user profiles.
  
- Get User Profile by Username:
  - GET https://battleshipcomp426.herokuapp.com/api/user/:username (replace :username with the username of the profile to retrieve)
  - Request Params: None
  - Response: Responds with an object in JSON format representing the requested user's profile.
  
- Update User Profile by Username:
  - PUT https://battleshipcomp426.herokuapp.com/api/user/:username (replace :username with the username of the profile to update)
  - Request Params (all optional by default, if not included then that field isn't updated): 
    - username (string)
    - password (string)
    - gamesPlayed (int)
    - wins (int)
    - losses (int)
    - shipsSunk (int)
  - Response: Responds with an object in JSON format representing the updated profile.
  
- Delete User Profile by Username:
  - PUT https://battleshipcomp426.herokuapp.com/api/user/:username (replace :username with the username of the profile to delete)
  - Request Params: None
  - Response: Responds with true upon successful deletion.
  
 
 The CRUD endpoints for accessing user profile data respond with a 403 unauthorized error if user is not logged in.
