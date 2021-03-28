const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cp = require('child_process')
const keyRoute = require('./routes/key_routes')

app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));
app.use('/shortUrl', keyRoute)

  const port = 3001
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

  var spawnGenerateKeys = function() {
    const child = cp.spawn(process.execPath, ['generateKeys']);
    child.stdout.on('data', (data) => { 
      console.log(`${data}`); 
    });

    child.stderr.on('data', (data) => { 
      console.error(`generateKeys::stderr: ${data}`); 
    });

    child.on('close', (code) => { 
      console.log(`generateKeys exited with code ${code}`); 
    });
  };
  spawnGenerateKeys();