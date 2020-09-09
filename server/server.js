const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4444;

// host: 'the-name-for-my-postgres-container-within-the-docker-compose-yml-file'
const { Client, Pool } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'db', // Uses docker network to connect
  database: 'postgres',
  password: 'password',
  port: 5432,
})
client.connect();

/***********************************************************/
/*************************Middleware************************/
/***********************************************************/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/***********************************************************/
/*************************Routes****************************/
/***********************************************************/
app.get('/', (req, res) => {
  console.log(`Received API request for /`);
  res.send('This is the NFL MVP API!');
})




/********************/
/*****Start-Up*******/
/********************/
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});