const { Pool, Client } = require('pg');
const {
  DB_USER,
  DB_HOST,
  DB_DATABASE,
  DB_PASSWORD,
  DB_PORT
} = require('./config');
const puppeteer = require('puppeteer');

// Connection to Postgres DB
const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
});

var start = Date.now();
const tableName = 'players';
const alphabet = [...Array(26)].map((val, i) => String.fromCharCode(i + 97));
console.log(alphabet);


// Scrape function to be invoked for each letter
async function scrape(letter) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.nfl.com/players/active/${letter}`);

  const data = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('table tr td'))
    return tds.map(td => td.innerText)
  });

  //You will now have an array of strings
  //[ 'One', 'Two', 'Three', 'Four' ]
  //console.log(data);
  //One
  //console.log(data[0]);

  // Send data to DB

  // For each letter, insert data into DB
  const addToDB = async () => {
    for (let i = 0; i < data.length; i += 4) {

      const send = async (i) => {
        client.query(`
              INSERT INTO ${tableName} (player, team, position, status)
              VALUES ($1, $2, $3, $4);
            `, [data[i], data[i+1], data[i+2], data[i+3]])
          .then(res => {

            //client.end();
          })
          .catch(err => {
            console.log(`Error inserting ${(i % 4) + 1}th player with ${letter} last name`, err);
            //client.end();
            return;
          });
      };
      await send(i);
      console.log(`Correctly inserted ${(i % 4) + 1}th player with ${letter} last name`);
    }
  };

  await addToDB();

  await browser.close();
};

// Connect to DB
client.connect()
  .then(res => {
    console.log(`\nConnected to the DB! Drop ${tableName} table if exists`, Date.now() - start, ' ms\n');

    return client.query(`
      DROP TABLE IF EXISTS ${tableName};
    `)
  })
  .then(res => {
    console.log(`\nSuccessfully dropped ${tableName} table! Now create it`, Date.now() - start, ' ms\n');

    return client.query(`
      CREATE TABLE ${tableName} (
        id SERIAL,
        player VARCHAR(40),
        team VARCHAR(40),
        position VARCHAR(10),
        status VARCHAR(10),
        PRIMARY KEY (id)
      );
    `)
  })
  .then(async (res) => {
    console.log(`\nCreated ${tableName} table, now to fill it!`,Date.now() - start, ' ms\n')

    for (let char of alphabet) {
      console.log(char);
      await scrape(char);
    }
    return 1+1;
  })
  .then(res => {
    console.log(`Scraped the webpage!`, Date.now() - start, ' ms');
    client.end();
  })
  .catch(err => {
    console.log(`Error in creating ${tableName} table: `, err);
    client.end();
  });

