# Booking Clone

Booking Clone is a fully functional API MERN App, designed to be used as a clone of a booking site, such as booking.com

## Installation

```bash
npm init
```
```bash
npm start
```
### Scripts

```java
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
```

### Dependencies
```java
  "dependencies": {
    "axios": "^1.4.0",
    "bcrypt": "^5.1.0",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.1",
    "mongodb": "^5.7.0",
    "mongoose": "^7.3.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
```

## Usage

### Routers

#### Auth routes: http://localhost:3000/auth
```java
POST: "/register"
POST: "/login"
POST: "/logout"
```

#### Users routes: http://localhost:3000/users
```java
POST: "/"
PUT:"/:id"
DELETE: "/:id"
GET: "/:id"
GET: "/"
```
#### Hotels routes: http://localhost:3000/hotels
```java
POST:"/"
PUT:"/:id"
DELET: "/:id"
GET: "/find/:id"
GET: "/"
GET: "/countByCity"
GET:"/countByType" # counts each type of accommodation, e.g. hotels / apartments 
GET: "/rooms/:id"
```
#### Rooms routes: http://localhost:3000/rooms
```java
POST: "/:hotelid"
PUT: "/:id"
DELETE: "/:id/:hotelid"
GET: "/:id"
GET: "/"
PUT:"/availability/:id" # Updates the subarray available dates in the room schema
```
### Front-end hooks

_See Front-end created files (below)_

### Personal notes / contributions

#### Project Goal 

To complete a more advanced back-end API with working authentication middleware, and begin to insert the routes as hooks into a react frontend

#### Contributions

The front-end app was mainly already created and cloned from an existing github repository. Therefore I have only included the files that I created during the process and supplmentary files to see how the front-end rendering would function (see below)

##### Front-end created files
- **useFetch.js**
- **AuthContext.js**
- **SearchContext.js**
- **login.jsx**
- **reserve.jsx**

##### Front-end supplmentary files
- **App.js**
- **List.js**

##### Successes
- I was able to individually create more advanced paths, using more advanced methods
- I successfully created a working authentication middleware with functional login / out functions
- I was able to start incorporating the back-end routes into front end UI files

##### Areas to work on
- As the front-end was already mainly completed (aside from the files mentioned above) It would have been easier for me to create the front-end myself, and the next project will focus on fully creating both front and back ends of an app
