const express = require('express')
const app = express()
const port = 3000
const apis = require('./routes/api/url_routes')
const users = require('./routes/api/user_routes')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use('/api', apis)
app.use('/user', users)

mongoose.connect(
  'mongodb://127.0.0.1:27017/tinyurl',
  {useNewUrlParser: true, useUnifiedTopology: true},
  () => {
    console.log('Connected to tinyurl db!');
  }
)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})