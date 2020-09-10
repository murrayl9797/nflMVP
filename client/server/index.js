var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
const PORT = 3000;
const cors = require('cors')


//Middleware
app.use(bodyParser.json());
app.use(cors());

// Due to express, when you load the page, it doesn't make a get request to '/', it simply serves up the dist folder
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  // Handles any requests that don't match the ones above
  res.sendFile('index.html', { root: path.join(__dirname, '../dist') });
});

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}!`);
});
