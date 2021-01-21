const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// MOGODB Connection
mongoose.connect(config.database);

// DB on Successful Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to the database', config.database)
})

// DB on Error Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to the database', config.database)
})

// Creating express application
const app = express();

// linking user routes
const users = require('./routes/users');

// Port Number
const port = process.env.PORT || 8080;

// MIDDLEWARE: cors - allows requests to the api from different domain name
app.use(cors());

// MIDDLEWARE: body parser - parses incomming request body
app.use(bodyParser.json());

// MIDDLEWARE: passport - tokenizer
app.use(passport.initialize());
app.use(passport.session())
require('./config/passport')(passport)

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Setting up user routes
app.use('/users', users);

// Index route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

// Start Server
app.listen(port, () => {
  console.log('Server started on port', port);
});
